import express, { NextFunction, Request, Response } from "express";
import Authentication from "../middlewares/authentication";
import authorization from "../middlewares/authorization";

const authRoute = express.Router();

authRoute.get(
  "/admin",
  Authentication,
  authorization("admin"),
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome Admin" });
  }
);

authRoute.get(
  "/manager",
  Authentication,
  authorization("admin", "manager"),
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome Manager" });
  }
);

authRoute.get(
  "/employee",
  Authentication,
  authorization("admin", "manager", "employee"),
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome Employee" });
  }
);

export default authRoute;
