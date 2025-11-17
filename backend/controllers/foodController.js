import foodModel from "../models/foodModel.js";
import fs from "fs";
import multer from "multer";
// add food item

const addFood = async (req, res) => {
     if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    })
    try {
        await food.save();
        res.json({success: true, message: "Food Added"});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "error"});
    }
}

// app food list
const listFood = async(req, res)=> {
    try {
        const foods = await foodModel.find({})
        res.send({success: true, data: foods})
    }catch(error) {
        console.log(error);
        res.send({success: false ,message: "Error"})
    }
}
// remove data
const removeFood = async(req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Food Removed"});
    } catch(error) {
        console.log(error);
        res.json({success: false, message: "Error"}); 
    }

}




///edit data 
 const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    res.json({ success: false, message: "Food not found" });
  }
};

 const updateFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const updateData = { name, description, price, category };
    if (image) updateData.image = image;

    await foodModel.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Failed to update food" });
  }
};



export {addFood, listFood, removeFood,getFoodById, updateFood};