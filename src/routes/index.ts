import { Router } from "express";
import user from "./user";
import url from "./url"

const router = Router();

router.use('/users', user)
router.use('/', url)

export default router;