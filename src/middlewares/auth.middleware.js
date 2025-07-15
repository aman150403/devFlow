import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt";

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers('Authorization')?.replace('Bearer ', '');

        if (!token) next(new ApiError(400, 'Unauthorized access request'));

        const decodedToken = verifyAccessToken(token, process.env.ACCESS_TOKEN_SECRET)

        const user = User.findById(decodedToken.id).select('-password')

        if (!user) next(new ApiError(400, 'User not found'))

        req.user = user
        next()
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

const restrictTo = async (...roles) => {
    return(req, res, next) => {
        if(!req.user || roles.includes(req.user.role)){
            return next(new ApiError(403, 'Access denied : Forbidden'))
        }
        next()
    }
}

export { 
    protect,
    restrictTo
}