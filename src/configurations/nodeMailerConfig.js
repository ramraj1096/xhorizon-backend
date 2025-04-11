import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  service: "gmail",
  auth: {
    user: "bandikarthik75@gmail.com",
    pass: "qxtt tjop lvvu mbcw" ,
  },
});
