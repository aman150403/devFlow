import express from 'express'
import {
  getAllTags,
  getPopularTags,
  autocompleteTags,
  getQuestionsByTags
} from '../controllers/tag.controller.js'

const router = express.Router()

router.get('/', getAllTags) 
router.get('/popular', getPopularTags)
router.get('/search', autocompleteTags)
router.get('/:tagName/questions', getQuestionsByTags);

export { router }