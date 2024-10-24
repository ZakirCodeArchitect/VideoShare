import jwt from "jsonwebtoken"
import { createError } from "./error.js"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.acess_token;
    if (!token) {
        return next(createError(401, "User is not authenticated"))
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return next(createError(404, "Token is not Found"))
        }
        req.user = user; // this is being compared with the :id
        next()
    })
}