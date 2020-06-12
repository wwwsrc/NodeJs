import { Router } from "express";
import { authController } from "./authController";

const router = Router();

router.post("/register", authController.validateSignUp, authController.signUp);
router.post("/login", authController.validateSignIn, authController.signIn);
router.post("/logout", authController.authorize, authController.signOut);

router.get(
  "/current",
  authController.authorize,
  authController.currentUserByToken
);

export const authRouter = router;
