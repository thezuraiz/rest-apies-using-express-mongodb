import express from "express";
import { createBookController } from "./book-controller";
import multer from "multer";
import path from "node:path";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: {
    fileSize: 10e7, // 30MB 30 * 1024 *1024
  },
});

// Create Book
bookRouter.post(
  "/",
  upload.fields([
    {
      name: "cover-image",
      maxCount: 1,
    },
    {
      name: "book-file",
      maxCount: 1,
    },
  ]),
  createBookController
);

export default bookRouter;
