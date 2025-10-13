import express, { response } from "express";
import authRoutes from "./src/routes/auth.routes.ts";
import cors from "cors";
import { connectDB } from "./src/config/db.ts";
import dotenv from "dotenv";
import {RedisClient} from "./src/services/redis.service.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
}));

connectDB();
RedisClient.connect();

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));