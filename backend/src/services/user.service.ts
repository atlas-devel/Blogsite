import { createError } from "../../utils/createError";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { Data } from "../types/types";
import bcrypt from "bcrypt";

export const registerService = async (RequestData: Data) => {
  const { name, email, password, role } = RequestData;
  if (!name || !email || !password || !role) {
    throw createError("Please provide name, email, password and role", 400);
  }

  const validateEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //check if email is valid

  const validatePassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; //check if password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, one number and one special character

  if (!validateEmail.test(email)) {
    throw createError(" Please provide a valid email", 400);
  }

  if (!validatePassword.test(password)) {
    throw createError(
      "VALIDATION_ERROR:  Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character",
      400,
    );
  }
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createError(
      "CONFLICT_ERROR: User with this email already exists",
      409,
    );
  }
  try {
    const hashPassword = await bcrypt.hash(password, 10); //hash the password with bcrypt
    const newUser = await createUser({
      name,
      email,
      password: hashPassword,
      role: role.toUpperCase() as "USER" | "ADMIN",
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const loginService = async (LoginData: Omit<Data, "role" | "name">) => {
  const { email, password } = LoginData;
  if (!email || !password) {
    throw createError("Please provide email and password", 400);
  }
  try {
    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw createError("Invalid email or password", 401);
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw createError("Invalid email or password", 401);
    }
    return existingUser;
  } catch (error) {
    throw error;
  }
};
