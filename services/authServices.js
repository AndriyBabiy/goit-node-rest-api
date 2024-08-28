import bcrypt from "bcrypt";

import User from "../db/models/User.js";

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

  // const { subscription } = data;

  // console.log(subscription);

  return user.update(
    { subscription: data },
    {
      returning: true,
    }
  );
};

export const signup = async (data) => {
  try {
    const { password } = data;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...data, password: hashPassword });
    return newUser;
  } catch (error) {
    if (error?.parent?.code === "23505") {
      error.message = "Email in use";
    }
    throw error;
  }
};
