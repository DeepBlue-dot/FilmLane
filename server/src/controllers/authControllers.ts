import { CookieOptions, RequestHandler } from "express";
import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler.js";


const cookieOptions: CookieOptions = {
    expires: new Date(
        Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 7) * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true
};

export const userRegester: RequestHandler = asyncHandler(
    async (req, res) => {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const user = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                passwordHash: password,
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

        res.status(201).json({
            status: "success",
            data: {
                user
            }
        })
        return
    })

export const userLogin: RequestHandler = asyncHandler(
    async (req, res) => {
        const { email, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        })

        if (user) {
            const valid = await bcrypt.compare(password, user.passwordHash)
            if (valid) {
                const token = jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET || "",
                    {
                        expiresIn: Number(process.env.JWT_COOKIE_EXPIRES_IN ?? 7) * 24 * 60 * 60
                    });

                res.cookie("jwt", token, cookieOptions);

                res.status(200).json({
                    status: "success",
                    data: {
                        user: {
                            id: user.id,
                            email: user.email,
                            username: user.username,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                        }
                    }
                });

                return;
            }
        }

        res.status(400).json({
            status: "failed",
            message: "Invalid email or password",
        })

        return
    })

export const userLogOut: RequestHandler = asyncHandler(
    async (req, res) => {
        res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });

        return
    })