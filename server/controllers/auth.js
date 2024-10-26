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
            // ...req.body is spread operator used to copy all the properties into new objects avoid manually listing them,
            const newUser = new User({...req.body, password: hash })

            await newUser.save(); // saving data in the database
            res.status(200).send("User has been created")
        } catch (err) {
            next(err)
        }
    }
    /*

    Looks up the user by their username,
    Validates the password,
    Generates a JWT if the credentials are correct,
    Sets the JWT as a cookie in the response,
    Responds with user details (excluding the password),
    Passes any errors to error-handling middleware.

    */

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

        // generating a jwt if user is found, with users unique ID as payload with a jwt secret key.
        const token = jwt.sign({ id: user._id }, process.env.JWT) // now this token will be used for authentication.

        // The destructuring { password, ...others } = user._doc is used to remove the password field from the user object while keeping all other properties (...others).
        // user._doc contains the actual user data because Mongoose models store document data within the _doc property.
        const { password, ...others } = user._doc; // everything except password


        // storing the jwt token in the access_token
        res.cookie("acess_token", token, {
            httpOnly: true // any configuration -- Setting httpOnly: true ensures the cookie is only accessible via HTTP and not through JavaScript in the browser, which improves security.
        }).status(200).json(others)

        // res.status(200).send("User Found")
    } catch (err) {
        next(err)
    }
}