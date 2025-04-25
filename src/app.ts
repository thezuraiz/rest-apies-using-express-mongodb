import globalErrorHandler from "./middlewares/global-error-handler";
// import createHttpError from "http-errors";
import express from "express";
import userRouter from "./user/user-router";

const app = express();

app.use(express.json()); // To get json data form client

// Routes
// Http methods: GET, POST, PUT, PATCH, DELETE
app.get("/", (req, res, next) => {
  // to throw an error
  // return next(createHttpError(400, "something went wrong"));
  res.json({ message: "Welcome to elib apis" });
});

// For users apies
app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
