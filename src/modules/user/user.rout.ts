import { Router } from "express";
import multer, { memoryStorage } from "multer";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./user.constants";
import parseData from "../../middleware/parseData";
import { userController } from "./user.controller";
import { createStoreValidator, statusUpdateValidator, updateStoreValidator, } from "./user.validator";
import req_validator from "../../middleware/req_validation";

const router = Router();
const storage = memoryStorage();

export const image_Upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 10 /* 10 mb */ },
    fileFilter(req, file, cb) {
        // const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        // if (allowedTypes.includes(file.mimetype)) {
        //     cb(null, true);
        // } else {
        //     cb(new Error('File type is not allowed'));
        // }
        cb(null, true);
    },
});


router.get(
    '/',
    auth(USER_ROLE.admin),
    userController.all_users,
);

router.patch(
    '/update-my-profile',
    auth(USER_ROLE.admin, USER_ROLE.user),
    image_Upload.single('image'),
    userController.updateProfile,
);

router.post(
    '/create-store',
    auth(USER_ROLE.user),
    image_Upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        }
    ]),
    createStoreValidator,
    req_validator(),
    parseData(),
    userController.createStoreProfile,
);

router.patch(
    '/update-store',
    auth(USER_ROLE.user),
    image_Upload.fields([
        {
            name: "image",
            maxCount: 1
        },
        {
            name: "banner",
            maxCount: 1
        }
    ]),
    updateStoreValidator,
    req_validator(),
    parseData(),
    userController.updateStoreProfile,
);

router.patch(
    '/status/:id',
    statusUpdateValidator,
    req_validator(),
    auth(USER_ROLE.admin),
    userController.update_user_status,
);

router.get(
    '/my-profile',
    auth(USER_ROLE.admin, USER_ROLE.user),
    userController.getMyProfile,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),
    userController.userDetails,
);

router.delete(
    '/delete-account',
    auth(USER_ROLE.user),
    userController.deletemyAccount,
);

router.delete(
    '/delete-account/:id',
    auth(USER_ROLE.admin),
    userController.deleteUser,
);

export const userRoutes = router;