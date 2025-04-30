import { v2 as cloudinary } from "cloudinary";
import { config as conf } from "./config";

cloudinary.config({
  cloud_name: conf.CLOUDINARY_NAME,
  api_key: conf.CLOUDINARY_API_KEY,
  api_secret: conf.CLOUDINARY_API_SECRET,
});

export default cloudinary;
