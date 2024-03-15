import {Router} from "express"
import { shortenUrl, getUrlById} from "../controller/url"

const router = Router()

router.post( "/shorten", shortenUrl)
router.get("/:_id", getUrlById)


export default router