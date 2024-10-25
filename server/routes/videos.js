import express from "express"
import { verifyToken } from "../verifyToken.js";
import { addVideo, addView, deleteVideo, getVideo, random, sub, trend, updateVideo } from "../controllers/video.js";

const router = express.Router()

// create a video
router.post("/", verifyToken, addVideo)
router.get("/find/:id", getVideo)
router.delete("/:id", verifyToken, deleteVideo)
router.put("/:id", verifyToken, updateVideo)
router.put("/views/:id", addView)
router.get("/trend", trend)
router.get("/random", random)
router.get("/sub", verifyToken, sub)

export default router;