import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getListConversation,
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();
router.get("/user", protectRoute, getUserForSidebar);
router.get("/conversation/:userId", protectRoute, getListConversation);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
