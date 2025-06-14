import { Router } from "express";
import { motorcycleControler } from "./motorcycle.controler";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import req_validator from "../../../middleware/req_validation";
import parseData from "../../../middleware/parseData";
import { addMotorcycleValidator } from "./motorcycle.validator";
import { multiple_image_Upload } from "../job/job.route";

const router = Router();

router.post("/",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addMotorcycleValidator,
    req_validator(),
    motorcycleControler.addMotorcycle);


export const motorcycleRoutes = router;