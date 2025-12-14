import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

async function registerUser(req, res, next) {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            next(new ApiError(400, 'All the fieldds are required'))
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            next(new ApiError(409, 'Email already in use'))
        }

        const user = await User.create({
            fullName,
            email,
            password
        });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        return res
            .status(201)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                samesite: 'Strict',
                secure: true
            })
            .json({
                success: true,
                user,
                message: 'User registered successfully',
                accessToken
            })


    } catch (error) {
        console.error(error);
        next(new ApiError(500, 'Internal Server Error'))
    }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ApiError(400, 'All the fields are required'));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ApiError(400, 'Invalid credentials'));
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const loggedInUser = await User.findById(user._id).select('-password');

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, options)
            .cookie('accessToken', accessToken, options)
            .json({
                message: 'User logged in successfully',
                success: true,
                loggedInUser
            });

    } catch (error) {
        console.error(error);
        return next(new ApiError(500, 'Internal Server Error'));
    }
}


async function logoutUser(req, res, next) {
    try {
        const id = req.user.id;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, 'User not found');
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie('refreshToken', options)
            .clearCookie('accessToken', options)
            .json({
                message: 'User logged out successFully',
                success: true
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server error'))
    }
}

async function refreshAccessToken(req, res, next) {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!token) next(new ApiError(400, 'Refresh token is missing'))

        const decodedToken = await verifyRefreshToken(token);

        const user = await User.findById(decodedToken.id);
        if (!user) next(new ApiError(400, 'Inalid refresh token'))

        const newAccessToken = await generateAccessToken(user)
        const newRefreshToken = await generateRefreshToken(user)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .json(200)
            .cookie('accessToken', newAccessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json({
                message: 'Refresh token is regenarated',
                success: true
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}