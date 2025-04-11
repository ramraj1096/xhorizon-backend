import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import otpRoute from "./routes/otpRoute.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const MONGODB_URL = "mongodb+srv://bandikarthik75:CWYFeZTCRe0sZgRQ@cluster0.aeqdj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


//middlewares
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

//mongodb config .
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("database connection successfull !"))
  .catch((err) => console.log(err));

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Health OK!" });
});

// api routes .
app.use("/api/users/", userRoute);
app.use("/api/otp/", otpRoute);

app.listen(7000, () => {
  console.log("app is running on port 7000");
});
