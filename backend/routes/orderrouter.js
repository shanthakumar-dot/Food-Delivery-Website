import express from "express"
import authUser from "../middlewar/auth.js"
import { placeorder } from "../controllers/ordercontroller.js"

const orderroute = express.Router()

orderroute.post("/place",authUser,placeorder)

export default orderroute