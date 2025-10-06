import bcrypt from "bcrypt";
import userModel from "../models/user.model";
import User from "../types/service.types";
import { RESPONSE_MESSAGE } from "../const/response.const";

export const registerUser = async (email :string, password: string): Promise<User> => {

  const existingUser = await userModel.findOne({ email });
  if (existingUser) throw new Error(RESPONSE_MESSAGE.USER_ALREADY_EXISTS);

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({ email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export const loginUser = async (email: string, password: string): Promise<User> => {

  const user = await userModel.findOne({ email });
  if (!user) throw new Error(RESPONSE_MESSAGE.USER_NOT_FOUND);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error(RESPONSE_MESSAGE.LOGIN_FAILED);

  return user;
};
