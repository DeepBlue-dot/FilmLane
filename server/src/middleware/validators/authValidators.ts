import { body } from "express-validator";
import validationRequest from "../validateRequest.js";
import prisma from "../../config/db.js";

export const validateUserRegistration = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
    ,

    body("email")
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
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),

    body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Confirm Password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    validationRequest
]

export const userLoginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    
    validationRequest,
];

