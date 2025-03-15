import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticateUser.js";
import { getUser } from "../controllers/userControllers.js";

const userRoutes: Router = Router()

userRoutes.get("/me", requireAuthentication, getUser)
userRoutes.get("/:id")
userRoutes.get("/")
userRoutes.put("/:id")
userRoutes.delete("/:id")
export default userRoutes