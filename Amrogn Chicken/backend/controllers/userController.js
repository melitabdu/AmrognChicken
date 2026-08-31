import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

// ----------------------------------------------------
// Create token
// ----------------------------------------------------

const createToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

};


// ----------------------------------------------------
// Login user
// ----------------------------------------------------

const loginUser = async (req, res) => {

    const { phone, password } = req.body;

    try {

        // Check if phone and password were provided

        if (!phone || !password) {

            return res.json({
                success: false,
                message: "Phone number and password are required"
            });

        }


        // Find user

        const user = await userModel.findOne({ phone });

        if (!user) {

            return res.json({
                success: false,
                message: "User does not exist"
            });

        }


        // Compare password

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.json({
                success: false,
                message: "Invalid phone number or password"
            });

        }


        // Create token

        const token = createToken(user._id);


        // Send response

        res.json({
            success: true,
            token
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.json({
            success: false,
            message: error.message
        });

    }

};


// ----------------------------------------------------
// Register user
// ----------------------------------------------------

const registerUser = async (req, res) => {

    const { name, phone, password } = req.body;

    try {

        // Check required fields

        if (!name || !phone || !password) {

            return res.json({
                success: false,
                message: "All fields are required"
            });

        }


        // Check whether user already exists

        const exists = await userModel.findOne({
            phone
        });

        if (exists) {

            return res.json({
                success: false,
                message: "User already exists"
            });

        }


        // Validate phone

        if (phone.length < 9) {

            return res.json({
                success: false,
                message: "Please enter a valid phone number"
            });

        }


        // Validate password

        if (password.length < 8) {

            return res.json({
                success: false,
                message: "Password must contain at least 8 characters"
            });

        }


        // Encrypt password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );


        // Create user

        const newUser = new userModel({
            name,
            phone,
            password: hashedPassword
        });


        const user = await newUser.save();


        // Create token

        const token = createToken(user._id);


        // Send response

        res.json({
            success: true,
            token
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        res.json({
            success: false,
            message: error.message
        });

    }

};


export {
    loginUser,
    registerUser
};