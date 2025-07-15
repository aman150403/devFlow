import { ApiError } from "../config/ApiError.js";

const globalApiHandler = (err, req, res, next) => {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode : err.statusCode,
            success : err.success ?? false,
            data : err.data ?? null,
            errors : err.errors,
            stack : err.stack,
        })
    }

    const statusCode = err.statusCode || 500;

    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error' : err.message || 'Something went wrong'
    
    if(process.env.NODE_ENV !== 'test'){
        console.log('Unhandled error', err);
    }

    return res.status(statusCode).json({
        success: false,
        data: null,
        message: message,
        errors: [],
        statusCode
    })
}

export { globalApiHandler };