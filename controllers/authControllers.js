import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";
import jsonwebtoken from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginError = HttpError(401, "Email or password is wrong");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.findUser({ email });
  if (!user) {
    throw loginError;
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw loginError;
  }

  const { id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
  await authServices.updateUser({ id }, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

const logout = async (req, res) => {
  const { id } = req.user;

  await authServices.updateUser({ id }, { token: "" });

  res.status(204).json({});
};

const updateSubscriptionUser = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { subscription: subscriptionNew } = req.body;

  const { id } = req.user;

  const { email, subscription } = await authServices.updateSubscription(
    { id },
    subscriptionNew
  );

  return res.json({
    user: {
      email: email,
      subscription: subscription,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
};
