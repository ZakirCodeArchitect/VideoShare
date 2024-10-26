import { createError } from "../error.js"
import User from "../models/user.js"
import video from "../models/video.js";

export const update = async(req, res, next) => {
    // This line checks if the id in the URL parameters (req.params.id) matches the id of the authenticated user (req.user.id).
    // req.user.id is set by the verifyToken middleware after verifying the JWT, ensuring the user is authenticated and has the correct id.
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body // ensures that only the fields in req.body are updated.
            }, { new: true }); // specifies that the updated document should be returned, not the original.
            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can update only your Account Details! "))
    }
}
export const deleteUser = async(req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted")
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(403, "You can delete only your Account Details! "))
    }
}
export const getUser = async(req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch (err) {
        next(err)
    }

}
export const subscribe = async(req, res, next) => {
    try {

        // This keeps track of which users the subscriber has subscribed to.
        await User.findByIdAndUpdate(req.user.id, { // This ID is available because it was set by authentication middleware, like verifyToken, which decoded the JWT.
            $push: { subscribedUsers: req.params.id }
        })

        // This line finds the user being subscribed to (identified by req.params.id) and increments their subscribers count by 1.
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        })

        res.status(200).json("Subscription successfull")
    } catch (err) {
        next(err)
    }
}
export const unsubscribe = async(req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id }
        })

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })

        res.status(200).json("Unsubscription successfull")
    } catch (err) {
        next(err)
    }
}
export const like = async(req, res, next) => {

    const id = req.user.id;
    const videoId = req.params.videoId;

    console.log("User ID:", id); // Log user ID for debugging
    console.log("Video ID:", videoId); // Log video ID for debugging

    try {
        await video.findByIdAndUpdate(videoId, {
            // using instead of push because if i like it again , it's gonna keep pushing.
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        }, { new: true })
        res.status(200).json("The video has been Liked")
    } catch (err) {
        next(err)
    }
}
export const dislike = async(req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;

    console.log("User ID:", id); // Log user ID for debugging
    console.log("Video ID:", videoId); // Log video ID for debugging

    try {
        await video.findByIdAndUpdate(videoId, {
            // using instead of push because if i like it again , it's gonna keep pushing.
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been disLiked")
    } catch (err) {
        next(err)
    }
}