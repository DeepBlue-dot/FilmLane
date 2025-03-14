import { Router } from "express";

const userRoutes: Router = Router()

userRoutes.get("/me")
userRoutes.get("/:id")
userRoutes.get("/")
userRoutes.put("/:id")
userRoutes.delete("/:id")
export default userRoutes