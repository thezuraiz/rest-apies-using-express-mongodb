import { NextFunction, Request, Response } from "express";

const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req: ", req.files);
  res.json({});
};

export { createBookController };
