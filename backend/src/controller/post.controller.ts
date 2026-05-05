import "dotenv/config";
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const createPost = async (req: Request, res: Response) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res
      .status(400)
      .json({ message: "Title, content, and category are required" });
  }
  console.log(req.file);
};
