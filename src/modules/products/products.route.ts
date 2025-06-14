import { Router } from "express";
import { productControler } from "./products.controler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constants";
import multer from "multer";
import path from 'node:path';
import parseData from "../../middleware/parseData";
import { motorcycleRoutes } from "../(category_modules)/motorcycle/motorcycle.route";
import { boatRoutes } from "../(category_modules)/boat/boat.route";
import { jobRoutes, multiple_image_Upload } from "../(category_modules)/job/job.route";
import { otherProductRoutes } from "../(category_modules)/others/others.route";

const router = Router();

router.get('/', productControler.allProducts);

router.get('/:id', productControler.singleProduct);

router.patch(
    '/:id',
    auth(USER_ROLE.admin),
    multiple_image_Upload,
    parseData(),
    productControler.updateProduct,
);

router.delete(
    '/:id',
    auth(USER_ROLE.admin),
    productControler.deleteProduct
);


const moduleRoutes = [
    {
        path: '/motorcycle',
        route: motorcycleRoutes,
    },
    {
        path: '/boat',
        route: boatRoutes,
    },
    {
        path: '/job',
        route: jobRoutes,
    },
    {
        path: '/other',
        route: otherProductRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));


export const productRoutes = router;

