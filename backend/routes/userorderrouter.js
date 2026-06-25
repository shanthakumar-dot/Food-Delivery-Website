import express from "express";
import authMiddleware from "../middlewar/auth.js";
import { userOrders, cancelOrder } from "../controllers/userordercontroller.js";

const userorderRouter = express.Router();

// Fetch orders for the logged-in user (POST: /api/userorder/order)
userorderRouter.post("/order", authMiddleware, userOrders);

// Cancel a pending/preparing order (POST: /api/userorder/cancel)
userorderRouter.post("/cancel", authMiddleware, cancelOrder);

export default userorderRouter;