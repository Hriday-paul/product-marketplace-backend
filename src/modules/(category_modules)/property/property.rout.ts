import { Router } from "express";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import { multiple_image_Upload } from "../job/job.route";
import parseData from "../../../middleware/parseData";
import { addPropertyRentValidator, addPropertySellValidator } from "./property.validator";
import req_validator from "../../../middleware/req_validation";
import { propertyControler } from "./property.controler";

const router = Router();

router.post("/sell",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addPropertySellValidator,
    req_validator(),
    propertyControler.addPropertySell);

router.post("/rent",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addPropertyRentValidator,
    req_validator(),
    propertyControler.addPropertyRent);


export const propertySellRoutes = router;