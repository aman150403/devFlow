import { User } from "../models/user.model.js"
import { Question } from '../models/question.model.js';
import { Answer } from '../models/answer.model.js';
import { Comment } from '../models/comment.model.js';
import { ApiError } from "../utils/ApiError.js"

async function changeUserRole(req, res, next) {
    try {
        const userId = req.params.id
        const { role } = req.body

        if (!['Admin', 'User', 'Moderator'].includes(role)) {
            return next(new ApiError(500, 'Invalid user role'))
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role: role },
            { new: true }
        ).select('password')

        if (!user) return next(new ApiError(400, 'User not found'))

        return res
            .status(200)
            .json({
                message: 'User role changed successfully',
                success: true,
                user
            })
    } catch (error) {
        console.error('Error : ', error)
        next(500, 'Internal server error')
    }
}

async function deactivateUser(req, res, next) {
    try {
        const userId = req.params.id

        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        ).select('password')

        if (!user) return next(new ApiError(400, 'User not found'))

        return res
            .status(200)
            .json({
                message: 'User status deactivated successfully',
                success: true,
                user
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function deleteAnswer(req, res, next) {
    try {
        const { id } = req.params;

        const answer = await Answer.findByIdAndDelete(id);
        if (!answer) return next(new ApiError(404, 'Answer not found'));

        res.status(200).json({ success: true, message: 'Answer deleted' });
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function deleteQuestion(req, res, next) {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndDelete(id);
        if (!question) return next(new ApiError(404, 'Question not found'));

        res.status(200).json({ success: true, message: 'Question deleted' });
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function deleteComment(req, res, next) {
    try {
        const { id } = req.params;

        const comment = await Comment.findByIdAndDelete(id);
        if (!comment) return next(new ApiError(404, 'Comment not found'));

        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function getAllUsers(req, res, next) {
    const page = Number(req.query?.page) || 1
    const limit = Number(req.query?.limit) || 10
    const skip = Number(page - 1) * limit

    const allUsers = await User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const usersCount = allUsers.length

    if(allUsers.length === 0) return next(new ApiError(200, 'No users found'))

    return res
        .status(200)
        .json({
            message: 'All users fetched',
            success: true,
            page,
            limit,
            usersCount,
            allUsers
        })
}

export {
    changeUserRole,
    deactivateUser,
    deleteAnswer,
    deleteComment,
    deleteQuestion,
    getAllUsers
}