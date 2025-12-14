import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.js";

const protect = async (req, res, next) => {
    try {
        // 1. Get token
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");

        if (!token) {
            return next(new ApiError(401, "Unauthorized access"));
        }

        // 2. Verify token
         const decoded = verifyAccessToken(token);

        // 3. Get user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new ApiError(401, "User not found"));
        }

        // 4. Attach user to request
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        next(new ApiError(401, "Invalid or expired token"));
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ApiError(403, "Access denied : Forbidden")
            );
        }
        next();
    };
};

export { 
    protect,
    restrictTo
}