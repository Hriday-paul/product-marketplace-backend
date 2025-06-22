import { Router } from "express";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import multer from "multer";
import path from 'node:path';
import req_validator from "../../../middleware/req_validation";
import parseData from "../../../middleware/parseData";
import { addJobValidator } from "./job.validator";
import { jobControler } from "./job.controler";

const router = Router();

export const file_upload_config = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public', 'images'));
    },
    filename: function (req, file, cb) {
        //original name helps us to get the file extension
        cb(null, Date.now() + "-" + file.originalname);
    },
});

export const multiple_image_Upload = multer({
    storage: file_upload_config,
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