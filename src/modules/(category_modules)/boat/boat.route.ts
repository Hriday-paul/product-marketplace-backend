import { Router } from "express";
import auth from "../../../middleware/auth";
import { USER_ROLE } from "../../user/user.constants";
import req_validator from "../../../middleware/req_validation";
import parseData from "../../../middleware/parseData";
import { addBoatValidator } from "./boat.validator";
import { boatControler } from "./boat.controler";
import { multiple_image_Upload } from "../job/job.route";

const router = Router();

router.post("/",
    auth(USER_ROLE.user),
    multiple_image_Upload,
    parseData(),
    addBoatValidator,
    req_validator(),
    boatControler.addBoat);


export const boatRoutes = router;