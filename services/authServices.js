import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

import User from "../db/models/User.js";
import sendEmail from "../helpers/sendEmail.js";

const { BASE_URL } = process.env;

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const updateUser = async (query, data) => {
  const user = await findUser(query);
  if (!user) {
    return null;
  }

  console.log(data);

  return user.update(data, {
    returning: true,
  });
};

export const updateSubscription = async (query, data) => {
  const user = await findUser(query);
  if (!user) {
    return null;
  }

  return user.update(
    { subscription: data },
    {
      returning: true,
    }
  );
};

export const updateAvatar = async (query, data) => {
  const user = await findUser(query);
  if (!user) {
    return null;
  }

  console.log(data);

  return user.update(
    { avatarURL: data },
    {
      returning: true,
    }
  );
};

export const sendVerifyEmail = (email, verificationCode) => {
  const verifyEmail = {
    to: email,
    subject: "Verify Email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
  };

  return sendEmail(verifyEmail);
};

export const signup = async (data) => {
  try {
    const { email, password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const hashEmail = await bcrypt.hash(email, 10);
    const avatar = `https://gravatar.com/avatar/${hashEmail}?d=mp`;
    const verificationCode = nanoid();
    const newUser = await User.create({
      ...data,
      password: hashPassword,
      avatarURL: avatar,
      verificationToken: verificationCode,
    });

    await sendVerifyEmail(data.email, verificationCode);

    return newUser;
  } catch (error) {
    if (error?.parent?.code === "23505") {
      error.message = "Email in use";
    }
    throw error;
  }
};
