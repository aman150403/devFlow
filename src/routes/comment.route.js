import { Router } from "express";
import {
    createComment,
    deleteComment,
    getComment,
    getCommentByAnswer,
    getCommentByQuestion,
    updateComment
} from "../controllers/comment.controller.js";
import { protect, restrictTo } from "../middlewares/auth.middleware.js"
import cache from '../middlewares/cache.middleware.js'

const commentRouter = Router();

commentRouter.get('/:id', cache(req => `comment:single:${req.params.id}`, 60), getComment);
commentRouter.post('/create-comment', protect, createComment);
commentRouter.put('/:id', protect, updateComment);
commentRouter.delete('/:id', protect, deleteComment)
commentRouter.get('/question/:id', cache(req => `comment:question:${req.params.id}`, 60), getCommentByQuestion);
commentRouter.get('/answer/:id', cache(req => `comment:answer:${req.params.id}`, 60), getCommentByAnswer);

export { commentRouter }