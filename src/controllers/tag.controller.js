import { Tag } from "../models/tag.model.js"

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

async function getPopularTage(_req, res, next){
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
