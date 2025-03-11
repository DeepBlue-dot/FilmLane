import { Router } from "express";
import { userRegester } from "../controllers/authControllers.js";
import { validateUserRegistration } from "../middleware/validators/authValidators.js";

const authRoutes = Router()

authRoutes.post("/register", validateUserRegistration ,userRegester)

export default authRoutes