import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../utils/prisma";
import { generateToken } from "../../utils/generateToken";
import "dotenv/config";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, password and role" });
  }
  const validateEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //check if email is valid
  const validatePassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; //check if password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, one number and one special character
  if (!validateEmail.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email" });
  }
  if (!validatePassword.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
    });
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10); //hash the password with bcrypt
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role: role.toUpperCase(),
      },
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server errors" + error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required",
    });
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        role: true,
      },
    });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = generateToken({
      id: existingUser.id,
      role: existingUser.role,
    }); //generate a token with the user's id as payload

    //send tojen in cookies

    res.cookie("login-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set sameSite to 'none' in production for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server errors",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies["login-token"];
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token provided",
    });
  }
  res.clearCookie("login-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set sameSite to 'none' in production for cross-site cookies
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
