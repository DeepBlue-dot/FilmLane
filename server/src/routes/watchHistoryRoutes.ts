import { Router } from "express";
import { addWatchHistoryItem, deleteHistoryItemById, deleteUserHistoryItem, getHistoryById, getUserWatchHistory, getWatchHistoryByUserId } from "../controllers/watchHistoryControllers.js";
import { requireAuthentication } from "../middleware/authenticateUser.js";
import { addWatchHistoryItemValidator } from "../middleware/validators/watchHistoryValidators.js";

const watchHistoryRoutes = Router();

watchHistoryRoutes.get("/users/:userId/watch-history", getWatchHistoryByUserId)
watchHistoryRoutes.get("/users/me/watch-history", requireAuthentication,getUserWatchHistory)
watchHistoryRoutes.post("/users/me/watch-history", requireAuthentication, addWatchHistoryItemValidator, addWatchHistoryItem)
watchHistoryRoutes.get("/users/:userId/watch-history/:ItemId", getHistoryById)
watchHistoryRoutes.get("/users/me/watch-history/:ItemId", getUserWatchHistory)
watchHistoryRoutes.delete("/users/:userId/watch-history/:ItemId", deleteHistoryItemById)
watchHistoryRoutes.delete("/users/me/watch-history/:ItemId",deleteUserHistoryItem)


export default watchHistoryRoutes;