import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";
import { parsePrismaQuery } from "../services/queryParser.js";


export const getUser = asyncHandler(
    async (req: any, res, next) => {
        const user = await prisma.user.findUnique(
            {
                where: {
                    id: req.user
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                    passwordHash: false
                }
            }
        )
        res.status(200).json({
            status: "success",
            data: {
                user: user
            }
        })
    }
)

export const getUserById = asyncHandler(
    async (req, res, next) => {
        const user = await prisma.user.findUnique(
            {
                where: {
                    id: req.params.id
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    createdAt: true,
                    updatedAt: true,
                    passwordHash: false
                }
            }
        )
        res.status(200).json({
            status: "success",
            data: {
                user: user
            }
        })
    }
)

export const getAllUsers = asyncHandler(
    async (req, res, next) => {
        const result = parsePrismaQuery(req, {
            allowedFields: ['id', 'email', 'createdAt'],
            dateFields: ['createdAt'],
            maxLimit: 50
        });

        const users = await prisma.user.findMany({
            skip: result.skip,
            take: result.take,
            where: result.where,
            orderBy: result.orderBy,
            select: result.select
        });

        res.status(200).json({
            status: "success",
            length: users.length,
            page: req.query.page,
            data: {
                users
            }
        })

    }
)

export const updateUser = asyncHandler(
    async (req, res, next) => {
        
    }
)

export const updateUserById = asyncHandler(
    async (req, res, next) => {

    }
)

export const deleteUser = asyncHandler(
    async (req, res, next) => {

    }
)

export const deleteUserById = asyncHandler(
    async (req, res, next) => {

    }
)