import { body } from "express-validator";
import validationRequest from "../validateRequest.js";
import prisma from "../../config/db.js";

export const addWatchHistoryItemValidator = [
    body("tmdbId")
        .trim()
        .notEmpty()
        .withMessage("tmdbId is required")
        .custom(
            async (value, { req }) => {
            const existingItem = await prisma.watchlistItem.findUnique({
                where: {
                    userId_tmdbId: {
                        userId: req.userId,
                        tmdbId: value,
                    },
                },
            })

            if (existingItem) {
                throw Error("Movie already in watchlist.")
            }
        }),

    validationRequest
]