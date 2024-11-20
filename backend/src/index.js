import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello, Worl11d!");
});
app.use("/api/auth", authRoutes);
app.listen(port, () => {
  console.log("server listening on port", port);
  connectDB();
});
