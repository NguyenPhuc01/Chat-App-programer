import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();

const port = process.env.PORT || 8080;
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173", // replace with your frontend URL
  })
);
app.get("/", (req, res) => {
  res.send("Hello, Worl11d!");
});
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
server.listen(port, () => {
  console.log("server listening on port", port);
  connectDB();
});
