import { Router } from "express";
import { addReviewValidator, reviewsParamValidator } from "./review.validator";
import req_validator from "../../middleware/req_validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constants";
import { reviewControler } from "./review.controler";

const router = Router();


router.post('/', auth(USER_ROLE.user), addReviewValidator, req_validator(), reviewControler.addReview);

router.get('/by-product/:id', auth(USER_ROLE.user), reviewsParamValidator, req_validator(), reviewControler.reviewsByProduct);

router.get('/my-product-reviews', auth(USER_ROLE.user), reviewControler.myProductsreviews);

export const reviewRoutes = router;