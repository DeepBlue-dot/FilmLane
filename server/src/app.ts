import express, { Express, Request, Response, Router } from "express";


const app: Express = express()

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});
const route: Router= express.Router()

export default app