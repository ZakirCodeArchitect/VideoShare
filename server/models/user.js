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
    // img: {
    //     type: String,
    //     required: true,
    // },
    // Members: { //  subscribers
    //     type: Number,
    //     default: 0,
    // },
    // groupUsers: { // subscribed users
    //     type: [String]
    // }
}, { timestamps: true });

export default mongoose.model("User", UserSchema)