import { NextFunction, Request, Response } from "express";
import { userInfo } from "node:os";

const ProtectedRoute = (req: Request, res: Response, next: NextFunction) => {
  if (!req.userInfo) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.userInfo.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};
