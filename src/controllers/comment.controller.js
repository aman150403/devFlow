import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function createComment(req, res, next) {
  try {
    const { content, parentId, questionId, answerId } = req.body;

    if (!content) return next(new ApiError(400, 'Content is required'));

    let depth = 0;
    if (parentId) {
      const parent = await Comment.findById(parentId); // ❌ FIXED: incorrect usage of findById
      if (!parent) return next(new ApiError(400, 'Parent comment not found'));
      depth = parent.depth + 1;
      if (depth > 2) return next(new ApiError(400, 'Maximum nesting level exceeded'));
    }

    const newComment = await Comment.create({
      content,
      author: req.user.id,
      parent: parentId || null,
      question: questionId || null,
      answer: answerId || null,
      depth
    });

    req.io?.emit('comment:created', newComment);

    return res.status(201).json({
      message: 'Comment created successfully',
      success: true,
      comment: newComment
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export async function updateComment(req, res, next) {
  try {
    const { updatedContent } = req.body;
    const id = req.params.id;

    if (!updatedContent) return next(new ApiError(400, 'Content is required'));

    const comment = await Comment.findById(id);
    if (!comment) return next(new ApiError(404, 'Comment not found'));

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Unauthorized'));
    }

    comment.content = updatedContent;
    comment.updatedAt = new Date();
    await comment.save();

    req.io?.emit('comment:updated', comment);

    return res.status(200).json({
      message: 'Comment updated successfully',
      success: true,
      comment
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export async function deleteComment(req, res, next) {
  try {
    const id = req.params.id;

    const comment = await Comment.findById(id);
    if (!comment) return next(new ApiError(404, 'Comment not found'));

    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Unauthorized'));
    }

    await comment.deleteOne();

    req.io?.emit('comment:deleted', { id });

    return res.status(200).json({
      message: 'Comment deleted successfully',
      success: true
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export async function getComment(req, res, next) {
  try {
    const id = req.params.id;

    const comment = await Comment.findById(id).populate('author', 'fullName email');
    if (!comment) return next(new ApiError(404, 'Comment not found'));

    return res.status(200).json({
      message: 'Comment fetched successfully',
      success: true,
      comment
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export async function getCommentByQuestion(req, res, next) {
  try {
    const questionId = req.params.id;

    const questionComments = await Comment.find({ question: questionId })
      .sort({ createdAt: -1 })
      .populate('author', 'fullName email');

    if (questionComments.length === 0) {
      return next(new ApiError(404, 'No comments found for this question'));
    }

    return res.status(200).json({
      message: 'All comments fetched for this question',
      success: true,
      comments: questionComments
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export async function getCommentByAnswer(req, res, next) {
  try {
    const answerId = req.params.id;

    const answerComments = await Comment.find({ answer: answerId })
      .sort({ createdAt: -1 })
      .populate('author', 'fullName email');

    if (answerComments.length === 0) {
      return next(new ApiError(404, 'No comments found for this answer'));
    }

    return res.status(200).json({
      message: 'All comments fetched for this answer',
      success: true,
      comments: answerComments
    });

  } catch (error) {
    console.error('Error:', error);
    next(new ApiError(500, 'Internal server error'));
  }
}

export {
    createComment,
    updateComment,
    deleteComment,
    getComment,
    getCommentByQuestion,
    getCommentByAnswer
}