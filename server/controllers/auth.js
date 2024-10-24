import { createError } from "../error.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async(req, res, next) => {
    // console.log(req.body)
    try {
        // encryting the passord
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password: hash })

        await newUser.save(); // saving data in the database
        res.status(200).send("User has been created")
    } catch (err) {
        next(err)
    }
}

export const signin = async(req, res, next) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (!user) {
            return next(createError(404, "User Not found "))
        }

        const isCorrect = await bcrypt.compare(req.body.password, user.password)

        if (!isCorrect) {
            return next(createError(404, "Wrong Password!"))
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT)
        const { password, ...others } = user._doc; // everything except password

        res.cookie("acess_token", token, {
            httpOnly: true // any configuration
        }).status(200).json(others)

        // res.status(200).send("User Found")
    } catch (err) {
        next(err)
    }
}