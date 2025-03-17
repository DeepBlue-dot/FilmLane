import { body } from "express-validator";
import validationRequest from "../validateRequest.js";
import prisma from "../../config/db.js";

export const addWatchListItemValidator = [
    body("tmdbId")
        .trim()
        .notEmpty()
        .withMessage("tmdbId is required")
        .isNumeric()
        .withMessage("Invalid tmdbId")
        .custom(
            async (value, { req }) => {
                const tmdbIdInt = parseInt(value, 10);
                const existingItem = await prisma.watchlistItem.findUnique({
                    where: {
                      userId_tmdbId: {
                        userId: req.userId,
                        tmdbId: tmdbIdInt,
                      },
                    },
                  });

                if (existingItem) {
                    throw Error("Movie already in watchlist.")
                }
            }),

    validationRequest
]