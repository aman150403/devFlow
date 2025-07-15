import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const verifyAccessToken = (accessToken) => {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
}

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
}

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}