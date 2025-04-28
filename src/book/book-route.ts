import express from "express";
import { createBookController } from "./book-controller";

const bookRouter = express.Router();

bookRouter.post("/", createBookController);

export default bookRouter;
