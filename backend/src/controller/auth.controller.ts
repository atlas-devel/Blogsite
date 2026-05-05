import { errorResponseMessage } from "./../../utils/responseMessage";
import type { Request, Response } from "express";
import { generateToken } from "../../utils/generateToken";
import "dotenv/config";
import { successResponseMessage } from "../../utils/responseMessage";
import { loginService, registerService } from "../services/user.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await registerService(req.body);

    successResponseMessage({
      res,
      statusCode: 201,
      message: "User registered successfully",
      data: {
        user: newUser,
      },
    });
  } catch (error: any) {
    console.log(error.statusCode);
    errorResponseMessage({
      res,
      statusCode: error?.statusCode || 500,
      message: error?.message || "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const existingUser = await loginService(req.body);

    const token = generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    res.cookie("login-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set sameSite to 'none' in production for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    successResponseMessage({
      res,
      message: "Login successful",
      data: {
        user: existingUser,
      },
    });
  } catch (error: any) {
    console.log("Error during login: " + error.message);
    console.log(error.statusCode);
    errorResponseMessage({
      res,
      statusCode: error?.statusCode || 500,
      message: error?.message || "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  console.log("Logout endpoint hit");
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
