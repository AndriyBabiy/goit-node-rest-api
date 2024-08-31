import { Router } from "express";

import authControllers from "../controllers/authControllers.js ";

import authenticate from "../middleware/authenticate.js";

import validateBody from "../helpers/validateBody.js";

import { authSignupSchema } from "../schemas/authSchema.js";
import upload from "../middleware/upload.js";

const signupMiddleware = validateBody(authSignupSchema);

const authRouter = Router();

authRouter.post("/register", signupMiddleware, authControllers.signup);

authRouter.post("/login", signupMiddleware, authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/subscription",
  authenticate,
  authControllers.updateSubscriptionUser
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  authControllers.updateAvatarUser
);

export default authRouter;
