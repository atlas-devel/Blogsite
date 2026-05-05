import prisma from "../../utils/prisma";
import { Data } from "../types/types";

export const createUser = async (data: Data) => {
  try {
    const newUser = await prisma.user.create({ data });
    return newUser;
  } catch (error) {
    console.log("Error creating user: " + error);
    throw Error("Error creating user: " + error);
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log("Error finding user by email: " + error);
    throw Error("Error finding user by email: " + error);
  }
};
