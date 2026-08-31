import express from "express";
import {
    addFood,
    listFood,
    removeFood
} from "../controllers/foodController.js";

import { upload } from "../config/cloudinary.js";

const foodRouter = express.Router();


// Get all food
foodRouter.get("/list", listFood);


// Add food
foodRouter.post(
    "/add",
    upload.single("image"),
    addFood
);


// Remove food
foodRouter.post(
    "/remove",
    removeFood
);


export default foodRouter;
