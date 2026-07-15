import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";
import { parsePrismaQuery } from "../services/queryParser.js";

export const getWatchHistoryByUserId = asyncHandler(
    async (req, res, next) => {
        const config = {
            allowedFields: ['id', 'tmdbId', 'mediaType', 'season', 'episode', 'watchedAt'],
            dateFields: ['watchedAt'],
            defaultLimit: 25,
            maxLimit: 100,
        };

        const queryOptions = parsePrismaQuery(req, config);

        const watchHistory = await prisma.watchHistory.findMany({
            where: {
                userId: req.params.userId,
                ...queryOptions.where,
            },
            skip: queryOptions.skip,
            take: queryOptions.take,
            orderBy: queryOptions.orderBy,
            select: queryOptions.select,
        });

        res.status(200).json({
            status: "success",
            length: watchHistory.length,
            data: watchHistory,
        });
    }
);

export const getUserWatchHistory = asyncHandler(
    async (req: any, res, next) => {
        const config = {
            allowedFields: ['id', 'tmdbId','mediaType', 'season', 'episode', 'watchedAt'],
            dateFields: ['watchedAt'],
            defaultLimit: 25,
            maxLimit: 100,
        };

        const queryOptions = parsePrismaQuery(req, config);

        const watchHistory = await prisma.watchHistory.findMany({
            where: {
                userId: req.userId,
                ...queryOptions.where,
            },
            skip: queryOptions.skip,
            take: queryOptions.take,
            orderBy: queryOptions.orderBy,
            select: queryOptions.select,
        });

        res.status(200).json({
            status: "success",
            length: watchHistory.length,
            data: watchHistory,
        });
    }
)

export const getUserHistoryItem = asyncHandler(
    async (req: any, res, next) => {
        const watchHistory = await prisma.watchHistory.findUnique({
            where: {
                userId: req.userId,
                id: req.params.ItemId
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                watchHistory
            }
        })
    }
)

export const getHistoryById = asyncHandler(
    async (req, res, next) => {
        const watchHistory = await prisma.watchHistory.findUnique({
            where: {
                userId: req.params.userId as string,
                id: req.params.ItemId as string
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                watchHistory
            }
        })
    }
)

export const addWatchHistoryItem = asyncHandler(
    async (req: any, res, next) => {
        const tmdbIdInt = parseInt(req.body.tmdbId, 10);
        const mediaType = req.body.mediaType;
        const season = req.body.season !== undefined && req.body.season !== null ? parseInt(req.body.season, 10) : null;
        const episode = req.body.episode !== undefined && req.body.episode !== null ? parseInt(req.body.episode, 10) : null;

        const newItem = await prisma.watchHistory.create({
            data: {
                tmdbId: tmdbIdInt,
                userId: req.userId,
                mediaType: mediaType,
                season: season,
                episode: episode
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                newItem
            }
        })
    }
)

export const deleteUserHistoryItem = asyncHandler(
    async (req: any, res, next) => {
        const watchHistory = await prisma.watchHistory.delete({
            where: {
                userId: req.userId,
                id: req.params.ItemId
            }
        })

        res.status(200).json({
            status: "success",
            data: null,
        })
    }
)

export const clearUserWatchHistory = asyncHandler(
    async (req: any, res, next) => {
        await prisma.watchHistory.deleteMany({
            where: {
                userId: req.userId
            }
        })

        res.status(200).json({
            status: "success",
            data: null,
        })
    }
)

export const deleteHistoryItemById = asyncHandler(
    async (req, res, next) => {
        const watchHistory = await prisma.watchHistory.delete({
            where: {
                userId: req.params.userId as string,
                id: req.params.ItemId as string
            }
        })

        res.status(200).json({
            status: "success",
            data: null,
        })
    }
)
