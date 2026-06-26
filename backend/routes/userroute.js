import express from "express";

import { register, login } from "../controllers/usercontroller.js";

const userrouter = express.Router();

userrouter.post("/login", login);

userrouter.post("/register",  register);

export default userrouter;
