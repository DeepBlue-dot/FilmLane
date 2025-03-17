import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";

export const authenticateUser: RequestHandler = asyncHandler(
    async (req, res, next) => {
        const token = req.cookies.jwt

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };

                const user = await prisma.user.findUnique({
                    where: {
                        id: decoded.id
                    },
                    select: { id: true }
                });

                if (!user) {
                    res.cookie("jwt", "loggedout", {
                        expires: new Date(Date.now()), // Expire immediately
                    });

                    res.status(401).json({
                        status: "failed",
                        message: "User no longer exists"
                    })

                    return;
                }
                (req as any).userId = user.id;

            } catch (error) {
                res.status(401).json({
                    status: "failed",
                    message: "Invalid or expired token",
                });

                return
            }
        }
        next()
    })

export const requireAuthentication: RequestHandler = asyncHandler(
    async (req: any, res, next) => {
        if (!req.userId) {
            res.status(401).json({
                status: "failed",
                message: "Unauthorized: Please login"
            })

            return
        }
        next()
    })