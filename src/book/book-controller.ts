import { NextFunction, Request, Response } from "express";

const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json({});
};

export { createBookController };
