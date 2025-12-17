import { Question } from '../models/question.model.js';
import { User } from '../models/user.model.js'
import { Answer } from '../models/answer.model.js'
import { Comment } from '../models/comment.model.js'
import { ApiError } from '../utils/ApiError.js';

async function getUserProfile(req, res, next) {
    try {
        const id = req.user.id;

        const user = await User.findById(id).select('-password');
        if (!user) return next(new ApiError(400, 'Usre not found'));

        return res
            .status(200)
            .json({
                message: 'Profile fetched successfully',
                success: true,
                user,
                status: 200
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server Error'))
    }
}

async function updateUserProfile(req, res, next) {
    try {
        const { fullName } = req.body;
        if (!fullName) return next(new ApiError(400, 'Fullname is required'))

        const id = req.user.id;

        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    fullName
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select('-password')

        if (!user) return next(new ApiError(400, 'User not found'));
        await invalidateByPrefix(`user:public:${id}`);

        return res
            .status(200)
            .json({
                message: 'User updated successfully',
                success: true,
                user
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server error'))
    }
}

async function deleteUserProfile(req, res, next) {
    try {
        const id = req.user.id;

        const user = await User.findByIdAndDelete(id);

        if (!user) return next(new ApiError(400, 'User not found'))

        await invalidateByPrefix(`user:public:${req.user.id}`);
            
        return res
            .status(200)
            .json({
                message: 'User profile deleted successfully',
                success: true
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server error'))
    }
}

async function getAllUsers(req, res, next) {
    try {
        const role = req.user.role;

        if (role !== 'admin') next(new ApiError(400, 'Access denied : forbidden'))

        const allUsers = await User.find({}).select('-password');

        if (!allUsers) return next(new ApiError(400, 'Users not found'));

        return res
            .status(200)
            .json({
                message: 'Users found',
                success: true,
                allUsers
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(400, 'Internal server error'))
    }
}

async function getPublicProfileStats(req, res, next){
    const userId = req.params.id

    const page = Number(req.query?.page) || 1
    const limit = Number(req.query?.limit) || 10
    const skip = (page - 1) * 10

    const userProfile = await User.findById( userId ).select('fullName email createdAt')

    if(!userProfile) return next(new ApiError(400, 'User not found'))

    const questions = await Question.find({ author: userId })
        .select('title content upvotes downvotes')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const answers = await Answer.find({ author: userId })
        .select('content upvotes downvotes')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

    const totalUpvotes = [...questions, ...answers]
        .reduce((sum, item) => sum + (item.upvotes?.length || 0), 0)


    const totalDownvotes = [...questions, ...answers]
        .reduce((sum, item) => sum + (item.downvotes?.length || 0), 0)

    const totalQuestions = questions.length
    const totalAnswers = answers.length
    const reputation = totalUpvotes - totalDownvotes

    return res
        .status(200)
        .json({
            message: 'User profile fetched successfully',
            success: true,
            userProfile,
            stats: {
                totalQuestions,
                totalAnswers,
                totalUpvotes,
                totalDownvotes,
                reputation
            },
            questions,
            answers
        })
}

async function getUserActivity(req, res, next){
    try {
        const userId = req.params.id
    
        const page = Number(req.query?.page) || 1
        const limit = Number(req.quert?.limit) || 10
        const skip = (page - 1) * 10
    
        const[questions, answers, comments] = await Promise.all([
            Question.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Answer.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Comment.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        ])
    
        const [questionCount, answerCount, commentCount] = await Promise.all([
            Question.countDocuments({ user: userId }),
            Answer.countDocuments({ user: userId }),
            Comment.countDocuments({ user: userId })
        ])
    
        return res
            .status(200)
            .json({
                message: 'User activity fetched successfully',
                success: true,
                stats: {
                    questionCount,
                    answerCount,
                    commentCount
                },
                page,
                limit,
                activit: {
                    questions,
                    answers,
                    comments
                }
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

export {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
    getPublicProfileStats,
    getUserActivity
}