import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

// ====================================================
// CREATE TOKEN
// ====================================================

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured on the server");
    }

    return jwt.sign(
        { id: String(id) },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

// ====================================================
// LOGIN USER
// ====================================================

const loginUser = async (req, res) => {
    try {
        let { phone, password } = req.body;

        console.log("========== LOGIN REQUEST ==========");
        console.log("Phone:", phone);
        console.log("Password provided:", !!password);
        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        console.log("===================================");

        // Required fields
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone number and password are required",
            });
        }

        // Clean phone
        phone = String(phone).trim();

        // Find user
        const user = await userModel.findOne({ phone });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone number or password",
            });
        }

        // Create token
        const token = createToken(user._id);

        console.log("LOGIN SUCCESS:", user._id);

        // Response
        return res.json({
            success: true,
            token,
        });

    } catch (error) {
        console.error("========== LOGIN ERROR ==========");
        console.error(error);
        console.error("=================================");

        return res.status(500).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};

// ====================================================
// REGISTER USER
// ====================================================

const registerUser = async (req, res) => {
    try {
        console.log("========== REGISTER START ==========");
        console.log("Request body:", {
            name: req.body.name,
            phone: req.body.phone,
            passwordProvided: !!req.body.password,
        });

        let { name, phone, password } = req.body;

        // Required fields
        if (!name || !phone || !password) {
            console.log("REGISTER FAILED: Missing fields");

            return res.status(400).json({
                success: false,
                message: "Name, phone number and password are required",
            });
        }

        // Clean values
        name = String(name).trim();
        phone = String(phone).trim();
        password = String(password);

        console.log("Cleaned data:", {
            name,
            phone,
            passwordProvided: !!password,
        });

        // Validate name
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid name",
            });
        }

        // Validate Ethiopian phone
        if (!/^09\d{8}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid Ethiopian phone number, for example 0912345678",
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters",
            });
        }

        console.log("Validation passed");

        // Check existing user
        const exists = await userModel.findOne({ phone });

        console.log("Existing user:", !!exists);

        if (exists) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this phone number already exists",
            });
        }

        // Hash password
        console.log("Hashing password...");

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        console.log("Password hashed");

        // Create user
        const newUser = new userModel({
            name,
            phone,
            password: hashedPassword,
        });

        console.log("User object created");

        // Save
        const user = await newUser.save();

        console.log(
            "USER SAVED SUCCESSFULLY:",
            user._id
        );

        // JWT
        const token = createToken(user._id);

        console.log("JWT CREATED SUCCESSFULLY");

        console.log("========== REGISTER SUCCESS ==========");

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token,
        });

    } catch (error) {
        console.error("========== REGISTER ERROR ==========");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        console.error("====================================");

        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};

// ====================================================
// EXPORT
// ====================================================

export {
    loginUser,
    registerUser,
    createToken,
};