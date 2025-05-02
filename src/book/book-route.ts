import express from "express";
import { createBookController, updateBookController } from "./book-controller";
import multer from "multer";
import path from "node:path";
import Authentication from "../middlewares/authorization";

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
  Authentication,
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

// Update Book
bookRouter.patch(
  "/:id",
  Authentication,
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
  updateBookController
);
export default bookRouter;
