import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";
import { parsePrismaQuery } from "../services/queryParser.js";

export const getWatchListByUserId = asyncHandler(
    async (req, res, next) => {
        const config = {
            allowedFields: ['id', 'tmdbId', 'MediaType','watchedAt'],
            dateFields: ['addedAt'],
            defaultLimit: 25,
            maxLimit: 100,
        };

        const queryOptions = parsePrismaQuery(req, config);

        const watchList = await prisma.watchlistItem.findMany({
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
            length: watchList.length,
            data: watchList,
        });
    }
);

export const getUserWatchList = asyncHandler(
    async (req: any, res, next) => {
        const config = {
            allowedFields: ['id', 'tmdbId','MediaType', 'watchedAt'],
            dateFields: ['addedAt'],
            defaultLimit: 25,
            maxLimit: 100,
        };

        const queryOptions = parsePrismaQuery(req, config);

        const watchList = await prisma.watchlistItem.findMany({
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
            length: watchList.length,
            data: watchList,
        });
    }
)

export const getUserWatchItem = asyncHandler(
    async (req: any, res, next) => {
        console.log("d")
        const wacthList = await prisma.watchlistItem.findUnique({
            where: {
                userId: req.userId,
                id: req.params.ItemId
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                wacthList
            }
        })
    }
)

export const getWatchItemById = asyncHandler(
    async (req, res, next) => {
        const wacthList = await prisma.watchlistItem.findUnique({
            where: {
                userId: req.params.userId,
                id: req.params.ItemId
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                wacthList
            }
        })
    }
)

export const addWatchListItem = asyncHandler(
    async (req: any, res, next) => {
        const tmdbIdInt = parseInt(req.body.tmdbId, 10);
        const mediaType = req.body.mediaType;

        const newItem = await prisma.watchlistItem.create({
            data: {
                tmdbId:tmdbIdInt ,
                userId: req.userId,
                mediaType: mediaType
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

export const deleteUserWatchItem = asyncHandler(
    async (req: any, res, next) => {
        const wacthList = await prisma.watchlistItem.delete({
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

export const deleteWatchItemById = asyncHandler(
    async (req, res, next) => {
        const wacthList = await prisma.watchlistItem.delete({
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
