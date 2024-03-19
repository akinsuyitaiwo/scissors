import {Router} from "express"
import { shortenUrl, getUrlById, verifyUrl, customiseUrl} from "../controller/url"
import Authentication from "../middleware/authentication"

const {verifyToken}= Authentication

const router = Router()

router.post( "/shorten", verifyToken, shortenUrl)
router.post("/", verifyToken, customiseUrl)
router.get("/user/:userId", verifyToken, getUrlById)
router.get("/:shortCode", verifyUrl)

export default router