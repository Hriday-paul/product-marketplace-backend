import { IJob } from "./job.interface";
import { Job } from "./job.model";


const addJob = async (payload: IJob) => {

    const res = await Job.create(payload)

    return res;
}

export const jobService = {
    addJob
}