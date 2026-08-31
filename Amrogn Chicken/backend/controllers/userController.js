const registerUser = async (req, res) => {
    try {
        let { name, phone, password } = req.body;

        console.log("REGISTER REQUEST:", {
            name,
            phone,
            passwordProvided: !!password
        });

        // Check required fields
        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Clean values
        name = String(name).trim();
        phone = String(phone).trim();
        password = String(password);

        // Validate name
        if (name.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid name"
            });
        }

        // Validate phone
        if (phone.length < 9) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        // Check existing user
        const exists = await userModel.findOne({ phone });

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
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

        console.log("USER CREATED:", user._id);

        // Create JWT
        const token = createToken(user._id);

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            token
        });

    } catch (error) {

        console.error("================================");
        console.error("REGISTER ERROR:");
        console.error(error);
        console.error("================================");

        return res.status(500).json({
            success: false,
            message: error.message || "Registration failed"
        });
    }
};