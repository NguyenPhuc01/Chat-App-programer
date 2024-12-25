import express from "express";
import {
  authorizationRoute,
  protectRoute,
} from "../middleware/auth.middleware.js";
import {
  checkIn,
  checkOut,
  getListCheckIn,
} from "../controllers/check.controller.js";

const router = express.Router();
router.post("/checkIn", protectRoute, checkIn);
router.post("/checkOut", protectRoute, checkOut);
router.get("/listCheckIn/:userId", protectRoute, getListCheckIn);

export default router;
