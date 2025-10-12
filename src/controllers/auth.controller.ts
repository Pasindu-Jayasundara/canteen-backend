import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.ts";
import { HTTP_STATUS } from "../const/http-status.const.ts";
import { RESPONSE_MESSAGE } from "../const/response.const.ts";
import { generateAccessToken, generateRefreshToken } from "../util/JWT_token.ts";
import { Redis_addValue } from "../services/redis.service.ts";

export const register = async (req: Request, res: Response) => {
  try {
    
    // const { email } = req.body;
    // const user = await registerUser(email);

    // res.status(HTTP_STATUS.CREATED).json({ message: RESPONSE_MESSAGE.USER_CREATED_SUCCESS, user });

  } catch (err: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {

    const { universityMail } = req.body;
    const user = await loginUser(universityMail);

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.NO_USER });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    Redis_addValue(user._id.toString(), refreshToken);

    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.LOGIN_SUCCESS, user: user, accessToken, refreshToken });

  } catch (err: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: err.message });
  }
};
