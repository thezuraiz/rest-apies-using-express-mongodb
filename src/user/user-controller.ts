import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    // Todo: Express Validator
    const error = createHttpError(500, "validation error");
    return next(error);
  }

  res.json({ name, email, password });
};

export { userRegisterController };
