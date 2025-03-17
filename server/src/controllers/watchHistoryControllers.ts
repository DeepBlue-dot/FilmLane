import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";
import { parsePrismaQuery } from "../services/queryParser.js";

export const getWatchHistoryByUserId = asyncHandler(
    async (req, res, next) => {
        const config = {
            allowedFields: ['id', 'tmdbId', 'watchedAt'],
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
            allowedFields: ['id', 'tmdbId', 'watchedAt'],
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
                userId: req.params.userId,
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

export const addWatchHistoryItem = asyncHandler(
    async (req: any, res, next) => {
        const newItem = await prisma.watchHistory.create({
            data: {
                tmdbId: req.body.tmdbId,
                userId: req.userId,
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

export const deleteHistoryItemById = asyncHandler(
    async (req, res, next) => {
        const watchHistory = await prisma.watchHistory.delete({
            where: {
                userId: req.params.userId,
                id: req.params.ItemId
            }
        })

        res.status(200).json({
            status: "success",
            data: null,
        })
    }
)
