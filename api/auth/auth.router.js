import { Router } from "express";
import { authController } from "./authController";
const router = Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/register", authController.validateSignUp, authController.signUp);
router.post("/login", authController.validateSignIn, authController.signIn);
router.post("/logout", authController.authorize, authController.signOut);

router.get(
  "/current",
  authController.authorize,
  authController.currentUserByToken
);

router.patch(
  "/avatars",
  authController.authorize,
  upload.single("avatar"),
  authController.updateAvatar
);

export const authRouter = router;
