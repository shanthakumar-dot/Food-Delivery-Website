import mongoose from "mongoose";

const dbURI =
  "mongodb://shanthan2005:96052005@ac-stbnlnv-shard-00-00.9y9kgr3.mongodb.net:27017,ac-stbnlnv-shard-00-01.9y9kgr3.mongodb.net:27017,ac-stbnlnv-shard-00-02.9y9kgr3.mongodb.net:27017/?ssl=true&replicaSet=atlas-29kqq5-shard-0&authSource=admin&appName=food-app";

export async function connectDB() {
  try {
    await mongoose.connect(dbURI);
    console.log("Successfully connected to MongoDB Atlas (food-app)!");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
}
