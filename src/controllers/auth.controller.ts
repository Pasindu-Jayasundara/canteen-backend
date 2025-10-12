import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service.ts";
import { HTTP_STATUS } from "../const/http-status.const.ts";
import { RESPONSE_MESSAGE } from "../const/response.const.ts";
import { generateAccessToken, generateRefreshToken } from "../util/JWT_token.ts";
import { Redis_addExpireValue, Redis_addValue, Redis_getAllValues, Redis_getValue, Redis_removeValue } from "../services/redis.service.ts";
import 'dotenv/config';
import Crypto from "crypto";
import sendEmail from "../services/email.service.ts";

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

    const otp = Crypto.randomBytes(4).toString('hex');
    Redis_addExpireValue(user._id.toString(), otp, 300); // OTP valid for 5 minutes

    sendEmail(user.universityMail, "Your OTP Code", `Your OTP code is: ${otp}`);

    res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.VERIFY_OTP, user: user });

  } catch (err: any) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {

  const { user, otp } = req.body;

  const storedOtp = await Redis_getValue(user._id.toString());

  if (storedOtp && storedOtp == otp) {

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    Redis_removeValue(user._id.toString(), otp);
    Redis_addValue(user._id.toString(), refreshToken, 7 * 24 * 60 * 60); // Refresh token valid for 7 days

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_INT!), // 7 days
    });

    return res.status(HTTP_STATUS.OK).json({ message: RESPONSE_MESSAGE.LOGIN_SUCCESS, user: user, accessToken: accessToken });
  }
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: RESPONSE_MESSAGE.INVALID_OTP });
};