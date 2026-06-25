import foodmodel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

const addfood = async (req, res) => {
  // image_filename gets the uploaded file's name from the request
  // req.file is provided by multer (or similar middleware) when a file is uploaded
  // `${req.file.filename}` is a template literal that converts the filename to a string
  let image_filename = `${req.file.filename}`;

  const food = new foodmodel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};
// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodmodel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
// remove food list

const remfood = async (req, res) => {
  try {
    const food = await foodmodel.findById(req.body.id);
    const filePath = path.join(process.cwd(), "uploads", food.image);
    fs.unlink(filePath, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
    await foodmodel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "foodremove" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { addfood, listFood, remfood };
