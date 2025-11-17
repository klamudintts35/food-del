// import foodModel from "../models/foodModel.js";
import express from "express";
import multer from "multer";
import { addFood ,listFood, removeFood, getFoodById, updateFood} from "../controllers/foodController.js";




const foodRouter = express.Router();


// image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename:(req, file, cd) => {
        return cd(null, `${Date.now()}${file.originalname}`)
    }
})
const upload = multer({storage:storage});
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.get("/:id", getFoodById);
foodRouter.put("/:id", upload.single("image"), updateFood);





// foodRouter.post("/add",upload.single("image"), addFood);


export default foodRouter;