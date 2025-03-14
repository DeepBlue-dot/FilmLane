import { Router } from "express";

 const userRoutes: Router = Router()

 userRoutes.get("/me")
 userRoutes.get("/:id")
 userRoutes.get("/")


export default userRoutes