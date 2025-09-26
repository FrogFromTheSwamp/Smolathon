import type { Job, SingleTaskStatus, WorkflowConfig } from '../../index.js';
import type { RetryConfig, TaskConfig } from '../config/types/taskTypes.js';
import type { TaskParent } from '../operations/runJobs/runJob/getRunTaskFunction.js';
export type TaskErrorArgs = {
    executedAt: Date;
    input?: object;
    job: Job;
    message: string;
    output?: object;
    parent?: TaskParent;
    retriesConfig: RetryConfig;
    taskConfig?: TaskConfig<string>;
    taskID: string;
    taskSlug: string;
    taskStatus: null | SingleTaskStatus<string>;
    workflowConfig: WorkflowConfig;
};
export type WorkflowErrorArgs = {
    job: Job;
    message: string;
    workflowConfig: WorkflowConfig;
};
export declare class TaskError extends Error {
    args: TaskErrorArgs;
    constructor(args: TaskErrorArgs);
}
export declare class WorkflowError extends Error {
    args: WorkflowErrorArgs;
    constructor(args: WorkflowErrorArgs);
}
export declare class JobCancelledError extends Error {
    args: {
        job: Job;
    };
    constructor(args: {
        job: Job;
    });
}
//# sourceMappingURL=index.d.ts.map