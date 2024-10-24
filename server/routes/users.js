import express from "express"
import { deleteUser, dislike, getUser, like, subscribe, unsubscribe, update } from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

// UPDATE A USER
router.put('/:id', verifyToken, update) // the :id will be compared with the user

// DELETE A USER
router.delete('/:id', deleteUser)

// GET USER
router.get('/find/:id', getUser)

// SUBSCRIBE USER
router.put('/sub/:id', subscribe)

// UNSUBSCRIBE USER -- ADD TO A GROUP / ORGANISATION
router.put('/unsub/:id', unsubscribe)

// LIKE A VIDEO
router.put('/like/:id', like)

// UNLIKE A VIDEO
router.put('/dislike/:videoId', dislike)

export default router;