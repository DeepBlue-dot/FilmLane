import { Router } from "express";
import { userLogin, userLogOut, userRegester } from "../controllers/authControllers.js";
import { userLoginValidator, validateUserRegistration } from "../middleware/validators/authValidators.js";

const authRoutes = Router()

authRoutes.post("/register", validateUserRegistration ,userRegester)
authRoutes.post("/login", userLoginValidator, userLogin)
authRoutes.get("/logout", userLogOut)


export default authRoutes