import userModel from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import fs from "fs";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server error" });
  }
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await userModel.findOne({ email }))
      return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email))
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });

    if (password.length < 8)
      return res.json({
        success: false,
        message: "Password must be 8+ characters",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();
    res.json({ success: true, token: createToken(user._id) });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { login, register };
