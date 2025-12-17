import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createAnswer,
  getAnswerByQuestion,
  getSingleAnswer,
  updateAnswer,
  deleteAnswer,
  voteAnswer
} from "../controllers/answer.controller.js";
import cache from '../middlewares/cache.middleware.js'

const answerRouter = Router();

answerRouter.post("/:questionId/create", protect, createAnswer); 
answerRouter.get("/:questionId", cache(req => `answers:question:${req.params.questionId}`, 90), protect, getAnswerByQuestion);
answerRouter.get("/single/:id", protect, cache(req => `answer:single:${req.params.id}`, 60),getSingleAnswer);       
answerRouter.put("/update/:id", protect, updateAnswer);          
answerRouter.delete("/delete/:id", protect, deleteAnswer);       
answerRouter.post("/vote/:id", protect, voteAnswer);             

export { answerRouter };
