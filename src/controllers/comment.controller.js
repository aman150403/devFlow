import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

async function createComment(req, res, next) {
  try {
    const { content, parentId, questionId, answerId } = req.body;

    // 1️⃣ Validate content
    if (!content || !content.trim()) {
      return next(new ApiError(400, "Content is required"));
    }

    // 2️⃣ Ensure comment belongs to either a question OR an answer
    if (!questionId && !answerId) {
      return next(
        new ApiError(400, "Comment must belong to a question or an answer")
      );
    }

    if (questionId && answerId) {
      return next(
        new ApiError(400, "Comment cannot belong to both question and answer")
      );
    }

    // 3️⃣ Validate ObjectIds
    if (
      (questionId && !mongoose.Types.ObjectId.isValid(questionId)) ||
      (answerId && !mongoose.Types.ObjectId.isValid(answerId))
    ) {
      return next(new ApiError(400, "Invalid question or answer ID"));
    }

    let depth;

    // 4️⃣ Handle nested comments
    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return next(new ApiError(400, "Invalid parent comment ID"));
      }

      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return next(new ApiError(400, "Parent comment not found"));
      }

      depth = parentComment.depth + 1;

      // Max nesting level: 2
      if (depth > 2) {
        return next(
          new ApiError(400, "Maximum nesting level exceeded")
        );
      }
    }

    // 5️⃣ Create comment
    const newComment = await Comment.create({
      content: content.trim(),
      author: req.user.id,
      parent: parentId || null,
      question: questionId || null,
      answer: answerId || null,
      depth // undefined for top-level → schema default (0)
    });

    // 6️⃣ Emit real-time event (optional)
    req.io?.emit("comment:created", newComment);

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment
    });

  } catch (error) {
    console.error("Error creating comment:", error);
    next(new ApiError(500, "Internal server error"));
  }
}

async function updateComment(req, res, next) {
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

async function deleteComment(req, res, next) {
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

async function getComment(req, res, next) {
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

async function getCommentByQuestion(req, res, next) {
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

async function getCommentByAnswer(req, res, next) {
  try {
    const { id: answerId } = req.params;

    // Optional but recommended: ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return next(new ApiError(400, "Invalid answer ID"));
    }

    const answerComments = await Comment.find({ answer: answerId })
      .sort({ createdAt: -1 })
      .populate("author", "fullName email");

    return res.status(200).json({
      success: true,
      message:
        answerComments.length === 0
          ? "No comments yet for this answer"
          : "Comments fetched successfully",
      total: answerComments.length,
      comments: answerComments
    });

  } catch (error) {
    console.error("Error:", error);
    next(new ApiError(500, "Internal server error"));
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