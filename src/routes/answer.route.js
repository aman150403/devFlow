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

const answerRouter = Router();

answerRouter.post("/:questionId/create", protect, createAnswer); 
answerRouter.get("/:questionId", protect, getAnswerByQuestion);  
answerRouter.get("/single/:id", protect, getSingleAnswer);       
answerRouter.put("/update/:id", protect, updateAnswer);          
answerRouter.delete("/delete/:id", protect, deleteAnswer);       
answerRouter.post("/vote/:id", protect, voteAnswer);             

export { answerRouter };
