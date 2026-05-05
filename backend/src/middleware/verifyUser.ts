import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies["login-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as { id: string; role:"admin" | "user"  };
    req.userInfo = decodedToken; // attach userId to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
