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

const commentRouter = Router();

commentRouter.get('/:id', getComment);
commentRouter.post('/create-comment', protect, createComment);
commentRouter.put('/:id', protect, updateComment);
commentRouter.delete('/:id', protect, deleteComment)
commentRouter.get('/question/:id', getCommentByQuestion);
commentRouter.get('/answer/:id', getCommentByAnswer);

export { commentRouter }