import { NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";


const validationRequest: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).mapped();

    if (Object.keys(errors).length > 0) {
        res.status(400).json({
            status: "fail",
            message: "Validation errors",
            errors: errors,
        });

        return;
    }

    next();
};

export default validationRequest