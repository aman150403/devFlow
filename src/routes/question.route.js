import { Router } from 'express';
import {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
  voteQuestion,
  searchQuestions
} from '../controllers/question.controller.js';

import { protect } from '../middlewares/auth.middleware.js';
import cache from '../middlewares/cache.middleware.js' 

const questionRouter = Router();

questionRouter.post('/create', protect, createQuestion);
questionRouter.get('/search', searchQuestions)
questionRouter.get('/all', cache("questions:all", 90), getAllQuestions);
questionRouter.get('/:id', cache(req => `question:single:${req.params.id}`, 90), getSingleQuestion);
questionRouter.put('/update/:id', protect, updateQuestion);
questionRouter.delete('/delete/:id', protect, deleteQuestion);
questionRouter.post('/vote/:id', protect, voteQuestion);

export { questionRouter };
