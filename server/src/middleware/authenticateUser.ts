import { RequestHandler } from "express";
import jwt from "jsonwebtoken"
import prisma from "../config/db.js";

export const authenticateUser: RequestHandler = async (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: number };
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
        }
        (req as any).user = user ;

    }
    next()
}