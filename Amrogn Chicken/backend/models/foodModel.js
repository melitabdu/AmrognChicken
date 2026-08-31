import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    // Cloudinary image URL
    image: {
        type: String,
        required: true
    },

    // Cloudinary public ID
    imagePublicId: {
        type: String,
        default: ""
    },

    category: {
        type: String,
        required: true
    }
});

const foodModel =
    mongoose.models.food ||
    mongoose.model("food", foodSchema);

export default foodModel;