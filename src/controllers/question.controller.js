import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { handleTags } from "../utils/tag.js";

async function createQuestion(req, res, next) {
    try {
        const { title, body, tags = [] } = req.body;
        if (!title || !body) next(new ApiError(400, 'Both the fields are required'))

        const cleanTags = handleTags(tags)

        const newQuestion = await Question.create({
            title,
            body,
            tags: cleanTags,
            author: req.user.id
        })

        if (!newQuestion) next(new ApiError(400, 'Question can not be posted'))

        return res
            .status(201)
            .json({
                message: 'Question posted successfully',
                success: true,
                newQuestion
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server error'))
    }
}

async function getAllQuestions(req, res, next) {
    try {
        const allQuestions = await Question.find({})

        if (allQuestions.length === 0) next(new ApiError(400, 'Questions not found'))
            .populate('author', 'fullName email')
            .sort({ createdAt: -1 })

        return res
            .status(200)
            .json({
                success: true,
                message: 'All the questions fetched successfully',
                allQuestions
            })
    } catch (error) {
        console.error('Error : ', error);
        next(new ApiError(500, 'Internal server error'))
    }
}

async function getSingleQuestion(req, res, next) {
    try {
        const id = req.params?.id

        const question = await Question.findById(id)
            .populate('author', 'fullName email')

        if (!question) next(new ApiError(400, 'Question not found'))

        return res
            .status(200)
            .json({
                success: true,
                message: 'Question fetched',
                question
            })
    } catch (error) {
        console.error('Error :', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function updateQuestion(req, res, next) {
    try {
        const id = req.params.id

        const { title, body } = req.body;

        if (!title || !body) next(new ApiError(400, 'Both the fields are required'));

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {
                $set: {
                    title,
                    body
                }
            },
            {
                new: true
            }
        )

        if (!updatedQuestion) {
            return next(new ApiError(404, 'Question not found'));
        }

        return res
            .status(200)
            .json({
                success: true,
                message: 'Question updated successfully',
                question: updatedQuestion
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function deleteQuestion(req, res, next) {
    try {
        const id = req.params.id

        const deletedQuestion = await Question.findByIdAndDelete(id)

        if (!deleteQuestion) next(new ApiError(400, 'Question not found'))

        return res
            .status(200)
            .json({
                success: true,
                message: 'Question deleted successfully'
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function voteQuestion(req, res, next) {
    try {
        const questionId = req.params.id
        const userId = req.params.id
        const { voteType } = req.body

        if (!['upvote', 'downvote'].includes(voteType)) {
            return next(new ApiError(400, 'Invalid vote type'))
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return next(new ApiError(404, 'Question not found'));
        }

        question.upvotes = question.upvotes.filter(uid => uid.toString() !== userId)
        question.downvotes = question.downvotes.filter(uid => uid.toString() !== userId)

        if (voteType === 'upvote') {
            question.upvotes.push(userId)
        } else {
            question.downvotes.push(userId)
        }

        await question.save();

        req.io.emit('question:voted', { id: question._id, upvotes: question.upvotes.length, downvotes: question.downvotes.length });

        return res
            .status(200)
            .json({
                success: true,
                message: 'Vote updated succcessfully',
                upvotesCount: question.upvotes.length,
                downvotesCount: question.downvotes.length,
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function searchQuestions(req, res, next) {
    try {
        let {
            keyword = '',
            tags = '',
            sortBy = 'createdAt',
            page = 1,
            limit = 10
        } = req.query

        page = Number(page)
        limit = Number(limit)
        const skip = (page - 1) * limit

        const query = {}

        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim())
            query.tags = { $in: tagArray }
        }

        if (keyword) {
            query.$text = { $search: keyword } // ✅ fixed typo
        }

        let sortOption = {}
        if (sortBy === 'createdAt') sortOption = { createdAt: -1 }
        else if (keyword) sortOption = { score: { $meta: 'textScore' } }

        const questions = await Question.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .select(
                keyword
                    ? {
                        score: { $meta: 'textScore' },
                        title: 1,
                        body: 1,
                        tags: 1,
                        upvotes: 1,
                        downvotes: 1,
                        author: 1,
                        createdAt: 1
                    }
                    : {}
            )

        const total = await Question.countDocuments(query)

        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: questions
        })
    } catch (error) {
        next(error)
    }
}



export {
    createQuestion,
    getAllQuestions,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    searchQuestions
}