import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticateUser.js";

const watchlistRoutes = Router()

watchlistRoutes.get("/users/:userId/watchlist-items")
watchlistRoutes.get("/users/me/watchlist-items", requireAuthentication)
watchlistRoutes.post("/users/me/watchlist-items", requireAuthentication)
watchlistRoutes.get("/users/:userId/watchlist-items/:itemId")
watchlistRoutes.get("/users/me/watchlist-items/:itemId", requireAuthentication)
watchlistRoutes.delete("/users/:userId/watchlist-items/:itemId")
watchlistRoutes.delete("/users/me/watchlist-items/:itemId", requireAuthentication)


export default watchlistRoutes