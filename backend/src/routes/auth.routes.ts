import { Router } from "express";
import express from "express";
import { login, logout, registerUser } from "../controller/auth.controller";

const authRoute: Router = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

export default authRoute;
