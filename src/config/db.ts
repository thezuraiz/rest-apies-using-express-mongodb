import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    // Register listeners first
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });
    // This call if called in future
    mongoose.connection.on("error", (err) => {
      console.log("Error in connecting to database: ", err);
    });
    await mongoose.connect(config.db as string);
  } catch (e) {
    console.error("Failed to connect Database: ", e);
    // End server if DB connection failed
    process.exit(1);
  }
};

export default connectDB;
