export class TaskError extends Error {
    args;
    constructor(args){
        super(args.message);
        this.args = args;
    }
}
export class WorkflowError extends Error {
    args;
    constructor(args){
        super(args.message);
        this.args = args;
    }
}
export class JobCancelledError extends Error {
    args;
    constructor(args){
        super(`Job ${args.job.id} was cancelled`);
        this.args = args;
    }
}

//# sourceMappingURL=index.js.map