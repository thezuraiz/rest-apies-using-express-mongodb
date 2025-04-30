import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import bookModel from "./book-model";
import fs from "fs";

const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;
    if (!body) {
      return next(createHttpError(300, "Missing Body Parameters"));
    }
    const { title, genre } = body;

    if (!title || !genre) {
      return next(createHttpError(300, "Missing parameters"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log("req.files: ", files);

    // For Cover Image
    const coverImage = files?.["cover-image"]?.[0];
    if (!coverImage) {
      return next(createHttpError("Cover image is required"));
    }

    const coverImageMimeType = coverImage.mimetype.split("/").at(-1);
    console.log("coverImageMimeType:", coverImageMimeType);

    const fileName = coverImage.filename;
    console.log("fileName: ", fileName);

    const coverFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    console.log("Cover file path: ", coverFilePath);

    const uploadCover = await cloudinary.uploader.upload(coverFilePath, {
      filename_override: fileName,
      folder: "book-covers",
    });

    console.log("uploadBookCoverResult: ", uploadCover);

    /// For Book
    const bookFile = files?.["book-file"]?.[0];
    if (!bookFile) {
      return next(createHttpError("book file is required"));
    }

    const bookMimeType = bookFile.mimetype.split("/").at(-1);
    console.log("bookMimeType:", bookMimeType);

    const bookFileName = bookFile.filename;
    console.log("bookFileName: ", bookFileName);

    const bookPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    console.log("file path: ", coverFilePath);

    const uploadBook = await cloudinary.uploader.upload(bookPath, {
      filename_override: bookFileName,
      folder: "books",
    });

    console.log("uploadBook: ", uploadBook);

    // Now save it in database
    const new_book = await bookModel.create({
      title,
      genre,
      author: "680b5602b861f9c1768b9a9e",
      coverImage: uploadCover.secure_url,
      file: uploadBook.secure_url,
    });

    await fs.promises.unlink(bookPath);
    await fs.promises.unlink(coverFilePath);

    res.status(200).json({
      id: new_book._id,
    });
  } catch (e) {
    console.log("error: ", e);
    return next(createHttpError(400, `Upload failed: ${e}`));
  }
};

export { createBookController };
