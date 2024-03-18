import {Router} from "express"
import { shortenUrl, getUrlById, verifyUrl} from "../controller/url"
import Authentication from "../middleware/authentication"

const {verifyToken}= Authentication

const router = Router()

router.post( "/shorten", verifyToken, shortenUrl)
router.get("/user/:userId", getUrlById)
router.get("/:shortCode", verifyUrl)

export default router