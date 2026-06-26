
import "dotenv/config"; 

import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import foodrouter from "./routes/foodroute.js";
import userrouter from "./routes/userroute.js";
import cartroute from "./routes/cartrouter.js";
import orderroute from "./routes/orderrouter.js";
import userorderRouter from "./routes/userorderrouter.js";

const app = express();  
const port = process.env.PORT || 3000; 
  
 
app.use(express.json());
app.use(cors());
    
  
app.use("/api/food", foodrouter);
app.use("/images", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/user", userrouter);
app.use("/api/cart", cartroute);
app.use("/api/order", orderroute);
app.use("/api/userorder", userorderRouter);


connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});