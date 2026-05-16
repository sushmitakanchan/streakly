import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "../routes/auth.routes.js";
import problemRoutes from "../routes/problem.routes.js";
import executionRoute from "../routes/executeCode.routes.js";
import submissionRoutes from "../routes/submission.route.js";
import playlistRoutes from "../routes/playlist.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("Welcome to streakly");
})

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problem", problemRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

if (process.env.VERCEL !== "1") {
    app.listen(process.env.PORT || 8080, ()=>{
        console.log("Server is running on port 8080");
    })
}

export default app
