import { NextFunction, RequestHandler } from "express";
import prisma from "../config/db.js";


const userRegester: RequestHandler = async (req, res, next) => {
    res.status(200).json(
        req.body
    )
};

export { userRegester }