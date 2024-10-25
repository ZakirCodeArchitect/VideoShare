import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    subscribers: { //  subscribers
        type: Number,
        default: 0,
    },
    subscribedUsers: { // subscribed users
        type: [String], // in this array there will be many Id's.
    }
}, { timestamps: true });

export default mongoose.model("User", UserSchema)