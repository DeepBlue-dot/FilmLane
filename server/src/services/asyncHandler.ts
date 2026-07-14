import { RequestHandler } from "express"
const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next) as any;
    };
};


export default asyncHandler