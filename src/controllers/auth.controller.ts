import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.js";
import { HTTP_STATUS } from "../const/http-status.const.js";
import { RESPONSE_MESSAGE } from "../const/response.const.js";

export const register = async (req: Request, res: Response) => {
  try {
    
    const { email, password } = req.body;
    const user = await registerUser(email, password);

    res.status(HTTP_STATUS.CREATED).json({ message: RESPONSE_MESSAGE.USER_CREATED_SUCCESS, user });

  } catch (err: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;
    const user = await loginUser(email, password);

    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.LOGIN_SUCCESS, user });

  } catch (err: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: err.message });
  }
};
