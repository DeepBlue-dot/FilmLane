import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";
import { parsePrismaQuery } from "../services/queryParser.js";
import bcrypt from "bcryptjs";



export const getUser = asyncHandler(
    async (req: any, res, next) => {
        const user = await prisma.user.findUnique(
            {
                where: {
                    id: req.userId
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
            allowedFields: ['id', 'email', 'username', 'createdAt', 'updatedAt'],
            dateFields: ['createdAt', 'updatedAt'],
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

export const updateUserById = asyncHandler(
    async (req, res, next) => {

    }
)

export const updateUser = asyncHandler(
    async (req: any, res, next) => {

        const updateData = { ...req.body }
        updateData.updatedAt = new Date()

        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(updateData.password, salt);
            updateData.passwordHash = password
            delete updateData.password
            delete updateData.confirmPassword
            delete updateData.oldPassword
        }


        const user = await prisma.user.update({
            where: {
                id: req.userId
            },
            data: {
                ...updateData,
            },
            select: {
                id: true,
                email: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                passwordHash: false
            }
        })

        res.status(200).json({
            status: "success",
            data: {
                user
            }
        })
    }
)

export const deleteUser = asyncHandler(
    async (req: any, res, next) => {
        const user = await prisma.user.delete({
            where: {
                id: req.userId
            }
        })

        res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() - 1000),
            httpOnly: true,
        });


        res.status(204).json({
            status: "success",
            data: null,
        });
    }
)

export const deleteUserById = asyncHandler(
    async (req, res, next) => {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })

        res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() - 1000),
            httpOnly: true,
        });


        res.status(204).json({
            status: "success",
            data: null,
        });

    }
)