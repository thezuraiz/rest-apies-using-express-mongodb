import express from "express";

import { userLoginController, userRegisterController } from "./user-controller";

const userRouter = express.Router();

userRouter.post("/register", userRegisterController);
userRouter.post("/login", userLoginController);

export default userRouter;
