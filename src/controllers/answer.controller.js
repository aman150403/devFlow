import { Answer } from "../models/answer.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

async function createAnswer(req, res, next) {
  try {
    const { content, question } = req.body;

    if (!content || !question) {
      return next(new ApiError(400, "Content and Question ID are required"));
    }

    const newAnswer = await Answer.create({
      content,
      author: req.user.id,
      question
    });

    if (!newAnswer) {
      return next(new ApiError(400, "Answer cannot be posted"));
    }

    return res.status(201).json({
      success: true,
      message: "Answer saved successfully",
      answer: newAnswer,
    });
  } catch (error) {
    next(new ApiError(500, error.message, [error]));
  }
}

async function getAnswerByQuestion(req, res, next) {
  try {
    const { questionId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return next(new ApiError(400, "Invalid question ID"));
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "fullName email")
      .sort({ createdAt: -1 });

    // Always return 200 with array (even if empty)
    return res.status(200).json({
      success: true,
      message: "Answers fetched successfully",
      answers
    });

  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
}

async function getSingleAnswer(req, res, next) {
  try {
    const id = req.params.id;
    const answer = await Answer.findById(id).populate("author", "fullName email");

    if (!answer) {
      return next(new ApiError(404, "Answer not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Answer found",
      answer,
    });
  } catch (error) {
    next(new ApiError(500, error.message, [error]));
  }
}

async function updateAnswer(req, res, next) {
  try {
    const { id: answerId } = req.params;
    const { content } = req.body;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return next(new ApiError(400, "Invalid answer ID"));
    }

    // 2️⃣ Validate content
    if (!content || !content.trim()) {
      return next(new ApiError(400, "Content is required"));
    }

    // 3️⃣ Fetch answer first (for ownership check)
    const answer = await Answer.findById(answerId);

    if (!answer) {
      return next(new ApiError(404, "Answer not found"));
    }

    // 4️⃣ Ownership / role check
    if (
      answer.author.toString() !== req.user.id &&
      !req.user.role.includes("admin")
    ) {
      return next(new ApiError(403, "You are not allowed to update this answer"));
    }

    // 5️⃣ Update answer
    answer.content = content;
    await answer.save();

    return res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      answer
    });

  } catch (error) {
    next(new ApiError(500, "Internal server error"));
  }
}

async function deleteAnswer(req, res, next) {
  try {
    const id = req.params.id;

    const deletedAnswer = await Answer.findByIdAndDelete(id);

    if (!deletedAnswer) {
      return next(new ApiError(404, "Answer not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    next(new ApiError(500, error.message, [error]));
  }
}

async function voteAnswer(req, res, next) {
  try {
    const answerId = req.params.id;
    const userId = req.user.id;
    const { voteType } = req.body;

    if (!["upvote", "downvote"].includes(voteType)) {
      return next(new ApiError(400, "Invalid vote type"));
    }

    const answer = await Answer.findById(answerId);

    if (!answer) {
      return next(new ApiError(404, "Answer not found"));
    }

    // Remove user from both arrays first (toggle vote)
    answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId);
    answer.downvotes = answer.downvotes.filter((id) => id.toString() !== userId);

    // Then push user to selected vote array
    if (voteType === "upvote") {
      answer.upvotes.push(userId);
    } else {
      answer.downvotes.push(userId);
    }

    await answer.save();

    //req.io.emit('answer:voted', { id: answer._id, upvotes: answer.upvotes.length, downvotes: answer.downvotes.length });

    return res.status(200).json({
      success: true,
      message: `Vote (${voteType}) registered successfully`,
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
    });
  } catch (error) {
    next(new ApiError(500, error.message, [error]));
  }
}

export {
  createAnswer,
  getAnswerByQuestion,
  getSingleAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer,
};
