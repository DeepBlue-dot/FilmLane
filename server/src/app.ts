import express, { Express } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middleware/authenticateUser.js";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());
app.use(authenticateUser);

app.use("/public/", express.static(path.join(process.env.PWD || "", "public")));
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)



export default app;


