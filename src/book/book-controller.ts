import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import path from "path";
import bookModel from "./book-model";
import fs from "fs";
import { AuthRequest } from "../middlewares/authorization";
import { TBook } from "./book-types";

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
    // console.log("req.files: ", files);
    // For Cover Image
    const coverImage = files?.["cover-image"]?.[0];
    if (!coverImage) {
      return next(createHttpError("Cover image is required"));
    }

    const coverImageMimeType = coverImage.mimetype.split("/").at(-1);
    console.log("coverImageMimeType:", coverImageMimeType);

    const fileName = coverImage.filename;
    // console.log("fileName: ", fileName);

    const coverFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );
    // console.log("Cover file path: ", coverFilePath);

    const uploadCover = await cloudinary.uploader.upload(coverFilePath, {
      filename_override: fileName,
      folder: "book-covers",
    });

    // console.log("uploadBookCoverResult: ", uploadCover);

    /// For Book
    const bookFile = files?.["book-file"]?.[0];
    if (!bookFile) {
      return next(createHttpError("book file is required"));
    }

    // Not required on new versions
    // const bookMimeType = bookFile.mimetype.split("/").at(-1);
    // console.log("bookMimeType:", bookMimeType);

    const bookFileName = bookFile.filename;
    // console.log("bookFileName: ", bookFileName);

    const bookPath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );
    // console.log("file path: ", coverFilePath);

    const uploadBook = await cloudinary.uploader.upload(bookPath, {
      filename_override: bookFileName,
      folder: "books",
    });

    // console.log("uploadBook: ", uploadBook);

    const _req = req as AuthRequest;

    // Now save it in database
    const new_book = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramsID = req.params.id;
    if (!paramsID) {
      return next(createHttpError(300, "Book Id Required"));
    }

    const book = await bookModel.findById(paramsID);
    // console.debug("book: ", book);
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const bookAuthor = book.author.toString();
    const _req = req as AuthRequest;
    if (_req.userId != bookAuthor) {
      return next(createHttpError(403, "Un Authorized"));
    }
    const request = req.body;
    if (!request) {
      return next(createHttpError(300, "Missing Body Parameters"));
    }

    const { title = book.title, genre = book.genre } = req.body;

    let uploadedCoverImage, uploadedBookCover;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // For Cover Image
    const coverImage = files?.["cover-image"]?.[0];
    if (coverImage) {
      const fileName = coverImage.filename;
      // console.log("fileName: ", fileName);

      const coverFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );
      // console.log("Cover file path: ", coverFilePath);

      uploadedCoverImage = await cloudinary.uploader.upload(coverFilePath, {
        filename_override: fileName,
        folder: "book-covers",
      });
      await fs.promises.unlink(coverFilePath);
      // console.log("uploadBookCoverResult: ", uploadedCoverImage);
    }

    /// For Book
    const bookFile = files?.["book-file"]?.[0];
    if (bookFile) {
      const bookFileName = bookFile.filename;
      // console.log("bookFileName: ", bookFileName);

      const bookPath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      // console.log("book path: ", bookPath);

      uploadedBookCover = await cloudinary.uploader.upload(bookPath, {
        filename_override: bookFileName,
        folder: "books",
      });

      // console.log("uploadBook: ", uploadedBookCover);

      await fs.promises.unlink(bookPath);
    }

    const updatedBook = await bookModel.findOneAndUpdate<TBook>(
      { _id: paramsID },
      {
        title: title ? title : book.title,
        genre: genre ? genre : book.genre,
        coverImage: uploadedCoverImage
          ? uploadedCoverImage.secure_url
          : book.coverImage,
        file: uploadedBookCover ? uploadedBookCover.secure_url : book.file,
      },
      { new: true } // return updated records
    );

    res.status(200).json({ book: updatedBook });
  } catch (e) {
    return next(createHttpError(500, `Something went wrong: ${e}`));
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const books = await bookModel.find();
    res.status(200).json(books);
  } catch (e) {
    return next(createHttpError(500, `Somthing went wrong! ${e}`));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bookId = req.params.id;
  console.debug("bookId:", bookId, typeof bookId);
  try {
    const book = await bookModel.findById(bookId);
    console.debug(book);

    res.status(200).json(book);
  } catch (_) {
    return next(createHttpError(404, "Book not found!"));
  }
};

export {
  createBookController,
  updateBookController,
  getAllBooks,
  getSingleBook,
};
