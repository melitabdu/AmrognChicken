import foodModel from "../models/foodModel.js";
import { cloudinary } from "../config/cloudinary.js";


// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});

        res.json({
            success: true,
            data: foods
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// add food
const addFood = async (req, res) => {
    try {

        if (!req.file) {
            return res.json({
                success: false,
                message: "Image is required"
            });
        }

        console.log("Cloudinary file:", req.file);

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,

            // Cloudinary image URL
            image: req.file.path,

            // Cloudinary public ID
            imagePublicId: req.file.filename,
        });

        await food.save();

        res.json({
            success: true,
            message: "Food Added",
            data: food
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


// delete food
const removeFood = async (req, res) => {
    try {

        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({
                success: false,
                message: "Food not found"
            });
        }

        // Delete image from Cloudinary
        if (food.imagePublicId) {
            await cloudinary.uploader.destroy(food.imagePublicId);
        }

        // Delete food from MongoDB
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({
            success: true,
            message: "Food Removed"
        });

    } catch (error) {
        console.log(error);

        res.json({
            success: false,
            message: "Error"
        });
    }
};


export {
    listFood,
    addFood,
    removeFood
};
