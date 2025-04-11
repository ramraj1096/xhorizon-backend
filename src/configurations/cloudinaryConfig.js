import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name:"dtkyixney",
  api_key:"741883434716657",
  api_secret:"7V9jzgRTomfDS69PW51-3SskTL4",
});

console.log("cloudinay connection successfull !.");

export default cloudinary;
