import { Router } from "express";
import { productControler } from "./products.controler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constants";
import parseData from "../../middleware/parseData";
import { motorcycleRoutes } from "../(category_modules)/motorcycle/motorcycle.route";
import { boatRoutes } from "../(category_modules)/boat/boat.route";
import { jobRoutes, multiple_image_Upload } from "../(category_modules)/job/job.route";
import { otherProductRoutes } from "../(category_modules)/others/others.route";
import { productQueryChecker } from "./products.validator";
import req_validator from "../../middleware/req_validation";
import { propertySellRoutes } from "../(category_modules)/property/property.rout";
import { carRoutes } from "../(category_modules)/car/car.rout";
import { CaravanRout } from "../(category_modules)/car/caravan.rout";
import { BobilRout } from "../(category_modules)/car/bobil.rout";

const router = Router();

router.get('/', productQueryChecker, req_validator(), productControler.allProducts);

router.get('/my-products', auth(USER_ROLE.user), productQueryChecker, req_validator(), productControler.myProducts);
router.get('/near-me', auth(USER_ROLE.user), productControler.nearMeProducts);

router.get('/:id', productControler.singleProduct);
router.get('/related/:id', productControler.relatedProducts);

router.patch(
    '/:id',
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    productControler.updateProduct,
);

router.delete(
    '/:id',
    auth(USER_ROLE.user),
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
    {
        path: '/property',
        route: propertySellRoutes,
    },
    {
        path: '/car',
        route: carRoutes,
    },
    {
        path: '/caravan',
        route: CaravanRout,
    },
    {
        path: '/bobil',
        route: BobilRout,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));


export const productRoutes = router;

