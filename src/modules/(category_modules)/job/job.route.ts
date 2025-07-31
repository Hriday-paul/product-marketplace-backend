import { Router } from "express";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import multer, { memoryStorage } from "multer";
import req_validator from "../../../middleware/req_validation";
import parseData from "../../../middleware/parseData";
import { addJobValidator } from "./job.validator";
import { jobControler } from "./job.controler";

const router = Router();

export const multiple_image_Upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 50 /* 50 mb */ },
    fileFilter(req, file, cb) {
        // if file type valid
        // if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.mimetype)) {
        //     cb(null, true)
        // }
        // else {
        //     cb(null, false);
        //     return cb(new Error('file type is not allowed'))
        // }
        cb(null, true)
    },
}).array('images');


router.post("/",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addJobValidator,
    req_validator(),
    jobControler.addJob);


export const jobRoutes = router;