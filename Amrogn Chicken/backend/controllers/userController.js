import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

// ====================================================
// CREATE TOKEN
// ====================================================

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error(
            "JWT_SECRET is not configured on the server"
        );
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
// NORMALIZE ETHIOPIAN PHONE
// ====================================================

const normalizePhone = (phone) => {
    let cleaned = String(phone || "")
        .trim()
        .replace(/\s+/g, "")
        .replace(/-/g, "");

    // +251912345678 -> 0912345678
    if (cleaned.startsWith("+251")) {
        cleaned = `0${cleaned.substring(4)}`;
    }

    // 251912345678 -> 0912345678
    else if (cleaned.startsWith("251")) {
        cleaned = `0${cleaned.substring(3)}`;
    }

    return cleaned;
};

// ====================================================
// LOGIN USER
// ====================================================

const loginUser = async (req, res) => {
    try {
        console.log("========== LOGIN REQUEST ==========");

        // Check body
        console.log("Request body:", {
            phone: req.body?.phone,
            passwordProvided: !!req.body?.password,
        });

        let { phone, password } = req.body || {};

        console.log(
            "JWT_SECRET exists:",
            !!process.env.JWT_SECRET
        );

        console.log("===================================");

        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Phone number and password are required",
            });
        }

        // ==================================================
        // CLEAN PHONE
        // ==================================================

        phone = normalizePhone(phone);

        console.log("Normalized login phone:", phone);

        // ==================================================
        // VALIDATE PHONE
        // ==================================================

        if (!/^09\d{8}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid Ethiopian phone number, for example 0912345678",
            });
        }

        // ==================================================
        // FIND USER
        // ==================================================

        const user = await userModel.findOne({
            phone,
        });

        if (!user) {
            console.log(
                "LOGIN FAILED: User does not exist"
            );

            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        console.log(
            "User found:",
            user._id
        );

        // ==================================================
        // CHECK PASSWORD
        // ==================================================

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            console.log(
                "LOGIN FAILED: Invalid password"
            );

            return res.status(401).json({
                success: false,
                message:
                    "Invalid phone number or password",
            });
        }

        // ==================================================
        // CREATE TOKEN
        // ==================================================

        const token = createToken(user._id);

        console.log(
            "LOGIN SUCCESS:",
            user._id
        );

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
        });

    } catch (error) {
        console.error(
            "========== LOGIN ERROR =========="
        );

        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        console.error(
            "================================="
        );

        return res.status(500).json({
            success: false,
            message:
                error.message || "Login failed",
        });
    }
};

// ====================================================
// REGISTER USER
// ====================================================

const registerUser = async (req, res) => {
    try {
        console.log(
            "========== REGISTER START =========="
        );

        // ==================================================
        // CHECK REQUEST BODY
        // ==================================================

        console.log("Request body:", {
            name: req.body?.name,
            phone: req.body?.phone,
            passwordProvided:
                !!req.body?.password,
        });

        let {
            name,
            phone,
            password,
        } = req.body || {};

        // ==================================================
        // REQUIRED FIELDS
        // ==================================================

        if (!name || !phone || !password) {
            console.log(
                "REGISTER FAILED: Missing fields"
            );

            return res.status(400).json({
                success: false,
                message:
                    "Name, phone number and password are required",
            });
        }

        // ==================================================
        // CLEAN VALUES
        // ==================================================

        name = String(name).trim();

        phone = normalizePhone(phone);

        password = String(password);

        console.log("Cleaned data:", {
            name,
            phone,
            passwordProvided:
                !!password,
        });

        // ==================================================
        // VALIDATE NAME
        // ==================================================

        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid name",
            });
        }

        // ==================================================
        // VALIDATE PHONE
        // ==================================================

        if (!/^09\d{8}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid Ethiopian phone number, for example 0912345678",
            });
        }

        // ==================================================
        // VALIDATE PASSWORD
        // ==================================================

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 8 characters",
            });
        }

        console.log(
            "Validation passed"
        );

        // ==================================================
        // CHECK EXISTING USER
        // ==================================================

        const exists =
            await userModel.findOne({
                phone,
            });

        console.log(
            "Existing user:",
            !!exists
        );

        if (exists) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this phone number already exists",
            });
        }

        // ==================================================
        // HASH PASSWORD
        // ==================================================

        console.log(
            "Hashing password..."
        );

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        console.log(
            "Password hashed"
        );

        // ==================================================
        // CREATE USER
        // ==================================================

        const newUser =
            new userModel({
                name,
                phone,
                password:
                    hashedPassword,
            });

        console.log(
            "User object created"
        );

        // ==================================================
        // SAVE USER
        // ==================================================

        const user =
            await newUser.save();

        console.log(
            "USER SAVED SUCCESSFULLY:",
            user._id
        );

        // ==================================================
        // CREATE JWT
        // ==================================================

        const token =
            createToken(user._id);

        console.log(
            "JWT CREATED SUCCESSFULLY"
        );

        console.log(
            "========== REGISTER SUCCESS =========="
        );

        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({
            success: true,
            message:
                "Registration successful",
            token,
        });

    } catch (error) {
        console.error(
            "========== REGISTER ERROR =========="
        );

        console.error(
            "Name:",
            error.name
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "===================================="
        );

        // ==================================================
        // DUPLICATE KEY ERROR
        // ==================================================

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "A user with this phone number already exists",
            });
        }

        // ==================================================
        // VALIDATION ERROR
        // ==================================================

        if (
            error.name ===
            "ValidationError"
        ) {
            const messages =
                Object.values(
                    error.errors || {}
                ).map(
                    (err) => err.message
                );

            return res.status(400).json({
                success: false,
                message:
                    messages.join(", ") ||
                    "User information is invalid",
            });
        }

        // ==================================================
        // GENERAL ERROR
        // ==================================================

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Registration failed",
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