import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
console.log("🚀 ~ process.env.PORT :", process.env.PORT);
app.get("/", (req, res) => {
  res.send("Hello, Worl11d!");
});
app.use("/api/auth", authRoutes);
app.listen(port, () => {
  console.log("server listening on port", port);
  connectDB();
});
