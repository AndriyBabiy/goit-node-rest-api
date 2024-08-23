import { Router } from "express";

import authControllers from "../controllers/authControllers.js ";

import validateBody from "../helpers/validateBody.js";

import { authSignupSchema } from "../schemas/authSchema.js";

const signupMiddleware = validateBody(authSignupSchema);

const authRouter = Router();

authRouter.post("/register", signupMiddleware, authControllers.signup);

authRouter.post("/login", signupMiddleware, authControllers.login);

export default authRouter;
