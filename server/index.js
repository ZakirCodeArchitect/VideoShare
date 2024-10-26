import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import videoRoues from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";

const app = express();

dotenv.config(); // we have to configure it must otherwise it'll not work
const connect = () => {
    mongoose.connect(process.env.MONGO).then(() => {
        console.log("Connected to DB")
    }).catch((err) => {
        throw new Error(err);
    })
}

const PORT = 3000;

app.use(cookieParser()) // parsing cookies into objects making them easy to read and manipulate.
app.use(express.json())

// routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoues)
app.use("/api/comments", commentRoutes)

// handling error in express
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.listen(PORT, () => {
    console.log(`Connected to Server`)
    connect();
})