import { Tag } from "../models/tag.model.js"
import { ApiError } from "../utils/ApiError.js"

async function getAllTags(_req, res, next) {
    try {
        const allTags = await Tag.find({}).sort({ name: 1 })    
        return res
            .status(200)
            .json({
                message: 'All tags fetched successfully',
                success: true,
                allTags
            })
    } catch (error) {
        console.error('Error : ', error)
        next (new ApiError(500, 'Internall server error'))
    }
}

async function getPopularTags(_req, res, next){
    try {
        const popularTags = await Tag.find({}).sort({ countUsage: -1 }).limit(20)
        return res
            .status(200)
            .json({
                message: 'Popular message etched successfully',
                success: true,
                popularTags
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function autocompleteTags(req, res, next){
    try {
        const keyword = req.query.keyword || ''
        const tags = await Tag.find({ name: { $regex: `^${keyword}`, $options: 'i' } }).limit(10)
        return res
            .status(200)
            .json({
                message: 'Tags matched successfully',
                success: true,
                tags
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

async function getQuestionsByTags(req, res, next){
    try {
        const { tags } = req.params
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * 10
    
        const questions = await Question.find({ tags: tagName })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
    
        const totalQuestions = questions.length
    
        return res
            .status(200)
            .json({
                success: true,
                message: 'All the questions fetched according to the tags',
                questions,
                totalQuestions,
                currentPage: page,
                totalPage: Math.ceil(totalQuestions/ limit)
            })
    } catch (error) {
        console.error('Error : ', error)
        next(new ApiError(500, 'Internal server error'))
    }
}

export { 
    getAllTags,
    getPopularTags,
    getQuestionsByTags,
    autocompleteTags
}