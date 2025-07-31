import { Router } from "express";
import { StoriesControler } from "./stories.controler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constants";
import req_validator from "../../middleware/req_validation";
import multer, { memoryStorage } from "multer";
import parseData from "../../middleware/parseData";
import { addLikeValidator, addStorieValidator } from "./stories.validator";

const router = Router();

export const video_Upload = multer({
    storage: memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 50 /* 50 mb */ },
    fileFilter(req, file, cb) {
        // if file type valid
        // if ([
        //     'video/mp4',
        //     'video/webm',
        //     'video/ogg',
        //     'video/x-msvideo',     // .avi
        //     'video/x-matroska',    // .mkv
        //     'video/3gpp',          // .3gp
        //     'video/3gpp2',         // .3g2
        //     'video/mpeg',          // .mpeg, .mpg
        //     'video/quicktime',     // .mov
        //     'video/x-flv'          // .flv
        // ].includes(file.mimetype)) {
        //     cb(null, true)
        // }
        // else {
        //     cb(null, false);
        //     return cb(new Error('file type is not allowed'))
        // }

        cb(null, true)
    },
});

router.get('/', StoriesControler.allStories);
router.post('/', video_Upload.single("video"),
    parseData(),
    addStorieValidator,
    req_validator(), auth(USER_ROLE.user), StoriesControler.addStorie);

router.post('/:id',
    addLikeValidator,
    req_validator(), auth(USER_ROLE.user), StoriesControler.addLikeToStorie);

export const ReelsRouts = router;