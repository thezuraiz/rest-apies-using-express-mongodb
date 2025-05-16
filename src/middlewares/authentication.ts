import { verify } from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
  role: string;
}

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

const Authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");
  if (!token) {
    return next(createHttpError(401, "Token Required"));
  }
  const parsedToken = token.split(" ")[1];
  try {
    const decoded = verify(parsedToken, config.secret as string) as JwtPayload;
    if (!decoded) {
      return next(createHttpError(400, `Invalid Token`));
    }
    const _req = req as AuthRequest;
    _req.userId = decoded.id;
    _req.role = decoded.role;
    next();
  } catch (e) {
    return next(createHttpError(500, `Un Authenticated: ${e}`));
  }
};

export default Authentication;
