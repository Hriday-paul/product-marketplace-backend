import { IProduct } from "../../products/products.interface";
import { Job } from "./job.model";


const addJob = async (body: IProduct) => {

    const { isPremium, boostActivatedAt, boostExpiresAt, createdAt, updatedAt, isDeleted, isPaid, ...payload } = body;

    const res = await Job.create(payload)

    return res;
}

export const jobService = {
    addJob
}