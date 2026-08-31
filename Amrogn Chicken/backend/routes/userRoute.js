import express from "express";
import {
    loginUser,
    registerUser
} from "../controllers/userController.js";

const userRouter = express.Router();

// Login
userRouter.post("/login", loginUser);

// Register
userRouter.post("/register", registerUser);

export default userRouter;