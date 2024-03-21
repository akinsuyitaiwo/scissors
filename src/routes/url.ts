import {Router} from "express"
import { shortenUrl, customiseUrl, viewLink, viewLinks, getURLAnalytics} from "../controller/url"
import Authentication from "../middleware/authentication"

const {verifyToken}= Authentication

const router = Router()

router.get("/create", (req, res) => {
	res.render("createUrl");
});
router.get("/customize", (req, res) => {
	res.render("customize");
});

router.post( "/create", verifyToken, shortenUrl)
router.post("/customize", verifyToken, customiseUrl)
router.get("/", verifyToken, viewLinks);
router.get("/:shortCode", viewLink);
router.get("/analytics/:shortCode", verifyToken, getURLAnalytics);


export default router