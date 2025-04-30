import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  db: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export const config = Object.freeze(_config);
