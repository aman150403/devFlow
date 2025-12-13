import express from 'express'
import {
  getAllTags,
  getPopularTags,
  autocompleteTags,
  getQuestionsByTags
} from '../controllers/tag.controller.js'

const tagRouter = express.Router()

tagRouter.get('/', getAllTags) 
tagRouter.get('/popular', getPopularTags)
tagRouter.get('/search', autocompleteTags)
tagRouter.get('/:tagName/questions', getQuestionsByTags);

export { tagRouter }