import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./user-model";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !password || !name) {
    // Todo: Express Validator
    const error = createHttpError(500, "validation error");
    return next(error);
  }

  // Find existing user
  const user = await userModel.findOne({ email });
  if (user) {
    const error = createHttpError(300, "User email already registered");
    return next(error);
  }

  // Encrypt the password
  const hashedPass = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    name,
    email,
    password: hashedPass,
  });

  // JWT Token NOTE: "Sign" ko jsonwebtoken sy import krna hy
  const token = await sign({ sub: newUser._id }, config.secret as string, {
    expiresIn: "7d",
    // algorithm: "HS256", bby default ye value pakarta hy
  });

  res.status(200).json({ accessToken: token });
};

export { userRegisterController };
