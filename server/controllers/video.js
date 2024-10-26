import User from "../models/user.js"
import Video from "../models/video.js"
import { createError } from "../error.js"

export const addVideo = async(req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });

    try {
        const savedVideo = await newVideo.save(); // saving the video in the database
        res.status(200).json(savedVideo); // sending response to show to the user that video has been saved.
    } catch (err) {
        next(err)
    }
}

export const getVideo = async(req, res, next) => {

    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (err) {
        next(err)
    }
}

export const updateVideo = async(req, res, next) => {

    try {
        const video = await Video.findById(req.params.id)
        if (!video) {
            return next(createError(404, "Video Not Found"))
        }
        if (req.user.id === Video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(200).json(updatedVideo)
        } else {
            return next(createError(403, "You can update only your video"))
        }
    } catch (err) {
        next(err)
    }
}

export const deleteVideo = async(req, res, next) => {

    try {
        const video = await Video.findById(req.params.id)
        if (!video) {
            return next(createError(404, "Video Not Found"))
        }
        if (req.user.id === Video.userId) {
            await Video.findByIdAndDelete(
                req.params.id,
            );
            res.status(200).json("The Video has been Deleted")
        } else {
            return next(createError(403, "You can delete only your video"))
        }
    } catch (err) {
        next(err)
    }
}

export const addView = async(req, res, next) => {

    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { view: 1 },
        });
        res.status(200).json("The view has been increased");
    } catch (err) {
        next(err)
    }
}

export const random = async(req, res, next) => {

    try {
        const videos = await Video.aggregate([{ $sample: { size: 50 } }]) // mongo DB function, just gonna give us sample of random videos -> 40 videos
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}

export const trend = async(req, res, next) => {

    try {
        const videos = await Video.find().sort({ views: -1 }); // mongoDB sort function , its gonna bring us most viewed videos as when we take -1 and least viewed videos if we take 1.
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}

// subscribed means marked or could be added to collection / group
export const sub = async(req, res, next) => {

    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId })
            })
        )

        // using the sort method from javascript to get the latest video first
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt)); // using javascript flat method in order to prevent the list in the nested Array in the response.
    } catch (err) {
        next(err)
    }
}

export const getByTag = async(req, res, next) => {

    const tags = req.query.tags.split(",")
        // console.log(tags);
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}

export const search = async(req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: {
                $regex: query,
                $options: "i"
            }
        }).limit(40);
        res.status(200).json(videos);
    } catch (err) {
        next(err)
    }
}