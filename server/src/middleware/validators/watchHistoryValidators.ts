import { body } from "express-validator";
import validationRequest from "../validateRequest.js";
import prisma from "../../config/db.js";
import HttpError from "../../utils/httpError.js";

const mediaTypes = [
    "MOVIE",
    "SERIES",
    "SEASON",
    "EPISODE"]

export const addWatchHistoryItemValidator = [
    body("mediaType")
        .trim()
        .notEmpty()
        .withMessage("mediaType is required")
        .custom(
            async (value, { req }) => {
                    if (!mediaTypes.includes(value)) {
                        throw new HttpError(400, "invalid mediaTypes");
                }
                return true;

            }),

    body("tmdbId")
        .trim()
        .notEmpty()
        .withMessage("tmdbId is required")
        .isNumeric()
        .withMessage("Invalid tmdbId")
        .custom(
            async (value, { req }) => {
                value = parseInt(value, 10);
                const existingItem = await prisma.watchlistItem.findFirst({
                    where: {
                        userId: req.userId,
                        tmdbId: value,
                        mediaType: req.body.mediaType
                    },
                })

                if (existingItem) {
                    throw new HttpError(409, "Item already exists in watch history.");
                }
                return true;

            }),

    validationRequest
]