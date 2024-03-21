import { Router } from "express";
import { createUser, loginUser } from "../controller/user";

const router = Router()

router.get("/register", (req, res) => {
	res.render("register");
});
  
router.get("/login", (req, res) => {
	res.render("login");
});

router.get("/dashboard", (req, res) => {
	res.render("dashboard");
});

router.post('/register', createUser)
router.post('/login', loginUser)

export default router;