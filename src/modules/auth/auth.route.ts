import { Router } from "express";
import { authController } from "./auth.controller.js";
import { userController } from "../users/user.controller.js";

const router = Router();

router.post("/signup", authController.signUpUser);
router.post("/login", authController.loginUser);

export const authRouter = router;
