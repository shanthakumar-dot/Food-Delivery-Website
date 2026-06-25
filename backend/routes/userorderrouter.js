import express from "express";
import authMiddleware from "../middlewar/auth.js";
import { userOrders, cancelOrder } from "../controllers/userordercontroller.js";

const userorderRouter = express.Router();

userorderRouter.post("/order", authMiddleware, userOrders);

userorderRouter.post("/cancel", authMiddleware, cancelOrder);

export default userorderRouter;
