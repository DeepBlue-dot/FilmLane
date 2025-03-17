import { Router } from "express";
import { requireAuthentication } from "../middleware/authenticateUser.js";
import { addWatchListItem, deleteUserWatchItem, deleteWatchItemById, getUserWatchItem, getUserWatchList, getWatchItemById, getWatchListByUserId } from "../controllers/watchListControllers.js";
import { addWatchListItemValidator } from "../middleware/validators/watchListValidators.js";

const watchlistRoutes = Router()

watchlistRoutes.get("/users/me/watchlist-Items", requireAuthentication, getUserWatchList)
watchlistRoutes.get("/users/:userId/watchlist-Items", getWatchListByUserId)
watchlistRoutes.post("/users/me/watchlist-Items", requireAuthentication, addWatchListItemValidator, addWatchListItem)
watchlistRoutes.get("/users/me/watchlist-Items/:ItemId", requireAuthentication, getUserWatchItem)
watchlistRoutes.get("/users/:userId/watchlist-Items/:ItemId", getWatchItemById)
watchlistRoutes.delete("/users/me/watchlist-Items/:ItemId", requireAuthentication, deleteUserWatchItem)
watchlistRoutes.delete("/users/:userId/watchlist-Items/:ItemId", deleteWatchItemById)


export default watchlistRoutes