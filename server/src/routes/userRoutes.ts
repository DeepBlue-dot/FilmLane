import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticateUser.js";
import { deleteUser, deleteUserById, getAllUsers, getUser, getUserById, updateUser, updateUserById } from "../controllers/userControllers.js";

const userRoutes: Router = Router()

userRoutes.get("/me", requireAuthentication, getUser)
userRoutes.put("/me", requireAuthentication, updateUser)
userRoutes.delete("/me", requireAuthentication, deleteUser)
userRoutes.get("/:id", getUserById)
userRoutes.get("/", getAllUsers)
userRoutes.put("/:id", updateUserById)
userRoutes.delete("/:id", deleteUserById)

export default userRoutes