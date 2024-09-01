import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as fs from "node:fs/promises";
import path from "node:path";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../helpers/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const checkInput = (data, message = "Body must have at least one field") => {
  if (Object.keys(data).length === 0) {
    throw HttpError(400, message);
  }
};

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

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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
  checkInput(req.body);

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

const avatarPath = path.resolve("public", "avatars");

const updateAvatarUser = async (req, res) => {
  if (!req.file) {
    throw HttpError(
      400,
      "Body must have at least one file in the avatarURL field"
    );
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);

  const { id } = req.user;
  const avatar = path.join("avatars", filename);

  const { avatarURL } = await authServices.updateAvatar({ id }, avatar);

  return res.json({
    user: {
      avatarURL,
    },
  });
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await authServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await authServices.updateUser(
    { verificationToken },
    {
      verify: true,
      verificationToken: null,
    }
  );

  return res.status(200).json({
    message: "Verification successful",
  });
};

const verifyUserRepeat = async (req, res) => {
  checkInput(req.body, "missing required field email");

  const { email } = req.body;

  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (!user.verificationToken) {
    throw HttpError(400, "Verification has already been passed");
  }

  await authServices.sendVerifyEmail(email, user.verificationToken);

  return res.status(200).json({
    message: "Verification email sent",
  });
};

export default {
  signup: ctrlWrapper(signup),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUser: ctrlWrapper(updateSubscriptionUser),
  updateAvatarUser: ctrlWrapper(updateAvatarUser),
  verifyUser: ctrlWrapper(verifyUser),
  verifyUserRepeat: ctrlWrapper(verifyUserRepeat),
};
