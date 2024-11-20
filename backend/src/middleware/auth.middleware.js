import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log("🚀 ~ protectRoute ~ req.cookies:", req.cookies);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized -No Token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized -Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password"); // tìm userID trong token và chỉ định k trả về password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
