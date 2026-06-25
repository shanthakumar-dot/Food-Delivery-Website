import { addtocart, getcart, removecart } from "../controllers/cartcontroller.js";
import express from "express"
import authUser from "../middlewar/auth.js";

const cartroute = express.Router()

cartroute.post("/addcart",authUser, addtocart)
cartroute.post("/remcart", authUser,removecart)
cartroute.post("/getcart", authUser,getcart)

export default cartroute
