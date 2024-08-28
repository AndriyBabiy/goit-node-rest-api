import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const authorizationError = HttpError(401, "Not authorized");

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next(authorizationError);
  }

  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(authorizationError);
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUser({ id });
    if (!user) {
      return next(authorizationError);
    }

    if (!user.token || user.token !== token) {
      return next(authorizationError);
    }

    req.user = user;

    next();
  } catch (error) {
    next(authorizationError);
  }
};

export default authenticate;
