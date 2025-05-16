import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "./authentication";

const authorization = (...allowedUsers: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as AuthRequest;
    console.log("_req: ", _req.role);
    if (!allowedUsers.includes(_req.role)) {
      res.status(401).json({ message: "Unauthorized - Access Denied" });
      return;
    }
    next();
  };
};

export default authorization;
