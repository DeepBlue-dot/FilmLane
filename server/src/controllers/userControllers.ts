import prisma from "../config/db.js";
import asyncHandler from "../services/asyncHandler.js";


export const getUser = asyncHandler(
    async(req:any, res, next) =>{
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