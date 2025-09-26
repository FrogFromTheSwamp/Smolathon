import { Forbidden } from '../../../errors/Forbidden.js';
import { isolateObjectProperty } from '../../../utilities/isolateObjectProperty.js';
import { jobsCollectionSlug } from '../../config/collection.js';
import { JobCancelledError } from '../../errors/index.js';
import { getCurrentDate } from '../../utilities/getCurrentDate.js';
import { updateJob, updateJobs } from '../../utilities/updateJob.js';
import { getUpdateJobFunction } from './runJob/getUpdateJobFunction.js';
import { importHandlerPath } from './runJob/importHandlerPath.js';
import { runJob } from './runJob/index.js';
import { runJSONJob } from './runJSONJob/index.js';
export const runJobs = async (args)=>{
    const { id, allQueues = false, limit = 10, overrideAccess, processingOrder, queue = 'default', req, req: { payload, payload: { config: { jobs: jobsConfig } } }, sequential, silent = false, where: whereFromProps } = args;
    if (!overrideAccess) {
        const accessFn = jobsConfig?.access?.run ?? (()=>true);
        const hasAccess = await accessFn({
            req
        });
        if (!hasAccess) {
            throw new Forbidden(req.t);
        }
    }
    const and = [
        {
            completedAt: {
                exists: false
            }
        },
        {
            hasError: {
                not_equals: true
            }
        },
        {
            processing: {
                equals: false
            }
        },
        {
            or: [
                {
                    waitUntil: {
                        exists: false
                    }
                },
                {
                    waitUntil: {
                        less_than: getCurrentDate().toISOString()
                    }
                }
            ]
        }
    ];
    if (allQueues !== true) {
        and.push({
            queue: {
                equals: queue ?? 'default'
            }
        });
    }
    if (whereFromProps) {
        and.push(whereFromProps);
    }
    // Find all jobs and ensure we set job to processing: true as early as possible to reduce the chance of
    // the same job being picked up by another worker
    let jobs = [];
    if (id) {
        // Only one job to run
        const job = await updateJob({
            id,
            data: {
                processing: true
            },
            depth: jobsConfig.depth,
            disableTransaction: true,
            req,
            returning: true
        });
        if (job) {
            jobs = [
                job
            ];
        }
    } else {
        let defaultProcessingOrder = payload.collections[jobsCollectionSlug]?.config.defaultSort ?? 'createdAt';
        const processingOrderConfig = jobsConfig.processingOrder;
        if (typeof processingOrderConfig === 'function') {
            defaultProcessingOrder = await processingOrderConfig(args);
        } else if (typeof processingOrderConfig === 'object' && !Array.isArray(processingOrderConfig)) {
            if (!allQueues && queue && processingOrderConfig.queues && processingOrderConfig.queues[queue]) {
                defaultProcessingOrder = processingOrderConfig.queues[queue];
            } else if (processingOrderConfig.default) {
                defaultProcessingOrder = processingOrderConfig.default;
            }
        } else if (typeof processingOrderConfig === 'string') {
            defaultProcessingOrder = processingOrderConfig;
        }
        const updatedDocs = await updateJobs({
            data: {
                processing: true
            },
            depth: jobsConfig.depth,
            disableTransaction: true,
            limit,
            req,
            returning: true,
            sort: processingOrder ?? defaultProcessingOrder,
            where: {
                and
            }
        });
        if (updatedDocs) {
            jobs = updatedDocs;
        }
    }
    /**
   * Just for logging purposes, we want to know how many jobs are new and how many are existing (= already been tried).
   * This is only for logs - in the end we still want to run all jobs, regardless of whether they are new or existing.
   */ const { existingJobs, newJobs } = jobs.reduce((acc, job)=>{
        if (job.totalTried > 0) {
            acc.existingJobs.push(job);
        } else {
            acc.newJobs.push(job);
        }
        return acc;
    }, {
        existingJobs: [],
        newJobs: []
    });
    if (!jobs.length) {
        return {
            noJobsRemaining: true,
            remainingJobsFromQueried: 0
        };
    }
    if (!silent || typeof silent === 'object' && !silent.info) {
        payload.logger.info({
            msg: `Running ${jobs.length} jobs.`,
            new: newJobs?.length,
            retrying: existingJobs?.length
        });
    }
    const successfullyCompletedJobs = [];
    const runSingleJob = async (job)=>{
        if (!job.workflowSlug && !job.taskSlug) {
            throw new Error('Job must have either a workflowSlug or a taskSlug');
        }
        const jobReq = isolateObjectProperty(req, 'transactionID');
        const workflowConfig = job.workflowSlug && jobsConfig.workflows?.length ? jobsConfig.workflows.find(({ slug })=>slug === job.workflowSlug) : {
            slug: 'singleTask',
            handler: async ({ job, tasks })=>{
                await tasks[job.taskSlug]('1', {
                    input: job.input
                });
            }
        };
        if (!workflowConfig) {
            return {
                id: job.id,
                result: {
                    status: 'error'
                }
            } // Skip jobs with no workflow configuration
            ;
        }
        try {
            const updateJob = getUpdateJobFunction(job, jobReq);
            // the runner will either be passed to the config
            // OR it will be a path, which we will need to import via eval to avoid
            // Next.js compiler dynamic import expression errors
            let workflowHandler;
            if (typeof workflowConfig.handler === 'function' || typeof workflowConfig.handler === 'object' && Array.isArray(workflowConfig.handler)) {
                workflowHandler = workflowConfig.handler;
            } else {
                workflowHandler = await importHandlerPath(workflowConfig.handler);
                if (!workflowHandler) {
                    const jobLabel = job.workflowSlug || `Task: ${job.taskSlug}`;
                    const errorMessage = `Can't find runner while importing with the path ${workflowConfig.handler} in job type ${jobLabel}.`;
                    if (!silent || typeof silent === 'object' && !silent.error) {
                        payload.logger.error(errorMessage);
                    }
                    await updateJob({
                        error: {
                            error: errorMessage
                        },
                        hasError: true,
                        processing: false
                    });
                    return {
                        id: job.id,
                        result: {
                            status: 'error-reached-max-retries'
                        }
                    };
                }
            }
            if (typeof workflowHandler === 'function') {
                const result = await runJob({
                    job,
                    req: jobReq,
                    silent,
                    updateJob,
                    workflowConfig,
                    workflowHandler
                });
                if (result.status === 'success') {
                    successfullyCompletedJobs.push(job.id);
                }
                return {
                    id: job.id,
                    result
                };
            } else {
                const result = await runJSONJob({
                    job,
                    req: jobReq,
                    silent,
                    updateJob,
                    workflowConfig,
                    workflowHandler
                });
                if (result.status === 'success') {
                    successfullyCompletedJobs.push(job.id);
                }
                return {
                    id: job.id,
                    result
                };
            }
        } catch (error) {
            if (error instanceof JobCancelledError) {
                return {
                    id: job.id,
                    result: {
                        status: 'error-reached-max-retries'
                    }
                };
            }
            throw error;
        }
    };
    let resultsArray = [];
    if (sequential) {
        for (const job of jobs){
            const result = await runSingleJob(job);
            if (result) {
                resultsArray.push(result);
            }
        }
    } else {
        const jobPromises = jobs.map(runSingleJob);
        resultsArray = await Promise.all(jobPromises);
    }
    if (jobsConfig.deleteJobOnComplete && successfullyCompletedJobs.length) {
        try {
            if (jobsConfig.runHooks) {
                await payload.delete({
                    collection: jobsCollectionSlug,
                    depth: 0,
                    disableTransaction: true,
                    where: {
                        id: {
                            in: successfullyCompletedJobs
                        }
                    }
                });
            } else {
                await payload.db.deleteMany({
                    collection: jobsCollectionSlug,
                    where: {
                        id: {
                            in: successfullyCompletedJobs
                        }
                    }
                });
            }
        } catch (err) {
            if (!silent || typeof silent === 'object' && !silent.error) {
                payload.logger.error({
                    err,
                    msg: `Failed to delete jobs ${successfullyCompletedJobs.join(', ')} on complete`
                });
            }
        }
    }
    const resultsObject = resultsArray.reduce((acc, cur)=>{
        if (cur !== null) {
            // Check if there's a valid result to include
            acc[cur.id] = cur.result;
        }
        return acc;
    }, {});
    let remainingJobsFromQueried = 0;
    for(const jobID in resultsObject){
        const jobResult = resultsObject[jobID];
        if (jobResult?.status === 'error') {
            remainingJobsFromQueried++ // Can be retried
            ;
        }
    }
    return {
        jobStatus: resultsObject,
        remainingJobsFromQueried
    };
};

//# sourceMappingURL=index.js.map