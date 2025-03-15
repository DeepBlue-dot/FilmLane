import { body } from "express-validator";
import validationRequest from "../validateRequest.js";
import prisma from "../../config/db.js";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";


const allowedFields = [
    "username",
    "email",
    "password",
    "confirmPassword",
    "oldPassword",
];

export const updateUserValidator = [
    ((req, res, next) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update data provided" });
        }
        next();
    }) as RequestHandler,

    // Validate allowed fields
    ((req, res, next) => {
        const invalidFields = Object.keys(req.body).filter(
            key => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Invalid fields provided: ${invalidFields.join(", ")}`,
                validFields: allowedFields
            });
        }
        next();
    }) as RequestHandler,

    body("username")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be at least 3 characters long")
    ,

    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            })
            if (existingUser) {
                throw new Error("Email already exists.");
            }
            return true;
        }),

    body("password")
        .optional()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .custom(async (password, { req }) => {
            if (password && !req.body.oldPassword) {
                throw new Error("Old password is required to update password");
            }

            if (password && !req.body.confirmPassword) {
                throw new Error("confirm password is required to update password");
            }
            return true;
        }),

    body("confirmPassword")
        .optional()
        .custom((confirmPassword, { req }) => {
            if (req.body.password && confirmPassword !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    body("oldPassword")
        .optional()
        .custom(async (oldPassword, { req }) => {
            if (req.body.password) {
                if (!oldPassword) {
                    throw new Error("Old password is required");
                }

                const user = await prisma.user.findUnique({
                    where: { id: req.user },
                    select: { passwordHash: true }
                });

                if (!user) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
                if (!isValid) {
                    throw new Error("Old password is incorrect");
                }
            }
            return true;
        }),

    validationRequest
]