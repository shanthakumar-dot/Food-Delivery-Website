import mongoose from "mongoose";


export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in your environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB Atlas (food-app)!");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); 
  }
}