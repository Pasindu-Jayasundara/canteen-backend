import jwt from "jsonwebtoken";
import type { User } from "../types/service.types.ts";

export const generateAccessToken = (user: User): string => {
    return jwt.sign(
        { ...user},
        process.env.JWT_ACCESS_TOKEN_SECRET as jwt.Secret, 
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
};

export const generateRefreshToken = (user: User): string => {
    return jwt.sign(
        {...user},
        process.env.JWT_REFRESH_TOKEN_SECRET as jwt.Secret,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );
};

export const verifyAccessToken = (token : string) : boolean => {
    try {
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as jwt.Secret);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};

export const verifyRefreshToken = (token : string) : boolean => {
    try {
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET as jwt.Secret);
        return true;
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};