import express, { Express } from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authenticateUser } from "./middleware/authenticateUser.js";
import { errorHandler, unknownURL } from "./middleware/errorMiddleware.js";
import watchlistRoutes from "./routes/WatchlistRoutes.js";
import watchHistoryRoutes from "./routes/watchHistoryRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";

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
app.use("/api", watchlistRoutes)
app.use("/api", watchHistoryRoutes)
app.use("/api", movieRoutes)
app.use("/api/auth", authRoutes)

app.all("*", unknownURL);
app.use(errorHandler);



export default app;


