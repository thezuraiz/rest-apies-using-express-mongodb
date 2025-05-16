import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./user-model";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import TUser from "./user-types";

const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const newUser: TUser = await userModel.create({
      name,
      email,
      password: hashedPass,
    });

    // JWT Token NOTE: "Sign" ko jsonwebtoken sy import krna hy
    const token = await sign(
      { id: newUser._id, role: newUser.role },
      config.secret as string,
      {
        expiresIn: "7d",
        // algorithm: "HS256", bby default ye value pakarta hy
      }
    );

    res.status(201).json({ accessToken: token });
  } catch (e) {
    return next(createHttpError(500, `something went wrong ${e}`));
  }
};

const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validation
    const data = req.body;
    if (!data) {
      return next(createHttpError(300, "Invalid Data format"));
    }
    const { email, password } = data;
    if (!email || !password) {
      return next(createHttpError(300, "Email and password required"));
    }

    // Check for is available in our database
    const findedUser = await userModel.findOne({ email });
    if (!findedUser) {
      return next(
        createHttpError("400", "User not found, please register first")
      );
    }

    // Match Password
    const isMatched = await bcrypt.compare(password, findedUser.password);
    if (!isMatched) {
      return next(createHttpError(300, "Incorect Password"));
    }

    // create token
    const token = await sign(
      { id: findedUser._id, role: findedUser.role },
      config.secret as string,
      {
        expiresIn: "7D",
      }
    );
    res.json({ accessToken: token });
  } catch (e) {
    return next(createHttpError(500, `Something went wrong ${e}`));
  }
};

export { userRegisterController, userLoginController };
