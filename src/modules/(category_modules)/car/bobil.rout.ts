import { Router } from "express";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import { multiple_image_Upload } from "../job/job.route";
import parseData from "../../../middleware/parseData";
import { addCaravanValidator } from "./car.validator";
import req_validator from "../../../middleware/req_validation";
import { carControler } from "./car.controler";

const router = Router();

router.post("/",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addCaravanValidator,
    req_validator(),
    carControler.addBobil);

    export const BobilRout = router;