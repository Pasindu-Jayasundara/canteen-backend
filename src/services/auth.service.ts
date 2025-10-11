import bcrypt from "bcrypt";
import userModel from "../models/user.model.ts";
import { RESPONSE_MESSAGE } from "../const/response.const.ts";
import type { User } from "../types/service.types.ts";

export const registerUser = async (universityMail: string, password: string): Promise<User> => {

  const existingUser = await userModel.findOne({ universityMail });
  if (existingUser) throw new Error(RESPONSE_MESSAGE.USER_ALREADY_EXISTS);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({ universityMail, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export const loginUser = async (universityMail: string): Promise<User> => {

  // const newUser = new userModel({ universityMail });
  // await newUser.save();

  const user = await userModel.findOne({ universityMail });
  if (!user) throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);

  // const isMatch = await bcrypt.compare(password, user.password);
  // if (!isMatch) throw new Error(RESPONSE_MESSAGE.LOGIN_FAILED);

  return user;
};
