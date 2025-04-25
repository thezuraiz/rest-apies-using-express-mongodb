import globalErrorHandler from "./middlewares/global-error-handler";
// import createHttpError from "http-errors";
import express from "express";

const app = express();

app.use(express.json());

// Routes
// Http methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res, next) => {
  // to throw an error
  // return next(createHttpError(400, "something went wrong"));
  res.json({ message: "Welcome to elib apis" });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
