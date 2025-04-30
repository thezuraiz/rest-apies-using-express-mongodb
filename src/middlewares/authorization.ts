import { verify } from "jsonwebtoken";

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId: string;
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
    const decoded = verify(parsedToken, config.secret as string);
    if (!decoded) {
      return next(createHttpError(400, `Invalid Token`));
    }
    // console.log("id: ", decoded.sub);
    // res.json({});
    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;
    next();
  } catch (e) {
    return next(createHttpError(500, `Un Authenticated: ${e}`));
  }
};

export default Authentication;
