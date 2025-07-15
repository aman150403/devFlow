import express from 'express'
import {
  getAllTags,
  getPopularTags,
  autocompleteTags
} from '../controllers/tag.controller.js'

const router = express.Router()

router.get('/', getAllTags) 
router.get('/popular', getPopularTags)
router.get('/search', autocompleteTags)

export { router }