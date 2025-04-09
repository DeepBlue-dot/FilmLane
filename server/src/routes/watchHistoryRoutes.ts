import { Router } from "express";
import { addWatchHistoryItem, deleteHistoryItemById, deleteUserHistoryItem, getHistoryById, getUserWatchHistory, getWatchHistoryByUserId } from "../controllers/watchHistoryControllers.js";
import { requireAuthentication } from "../middleware/authenticateUser.js";
import { addWatchHistoryItemValidator } from "../middleware/validators/watchHistoryValidators.js";

const watchHistoryRoutes = Router();

watchHistoryRoutes.get("/users/me/watch-history", requireAuthentication, getUserWatchHistory)
watchHistoryRoutes.get("/users/:userId/watch-history", getWatchHistoryByUserId)
watchHistoryRoutes.post("/users/me/watch-history", requireAuthentication, addWatchHistoryItemValidator, addWatchHistoryItem)
watchHistoryRoutes.get("/users/me/watch-history/:ItemId", getUserWatchHistory)
watchHistoryRoutes.get("/users/:userId/watch-history/:ItemId", getHistoryById)
watchHistoryRoutes.delete("/users/me/watch-history/:ItemId",deleteUserHistoryItem)
watchHistoryRoutes.delete("/users/:userId/watch-history/:ItemId", deleteHistoryItemById)


export default watchHistoryRoutes;