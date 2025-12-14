import { Router } from "express";

import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import {
    changeUserRole,
    deactivateUser,
    deleteAnswer,
    deleteComment,
    deleteQuestion,
    getAllUsers
} from "../controllers/admin.controller.js";

const adminRouter = Router()

adminRouter.patch('/user/role/:id', protect, restrictTo('Admin'), changeUserRole);
adminRouter.patch('/user/:id/deactivate', protect, restrictTo('Admin'), deactivateUser);
adminRouter.get('/all-users', protect, restrictTo('Admin'), getAllUsers);
adminRouter.delete('/question/:id', protect, restrictTo('Admin', 'Moderator'), deleteQuestion);
adminRouter.delete('/answer/:id', protect, restrictTo('Admin', 'Moderator'), deleteAnswer);
adminRouter.delete('/comment/:id', protect, restrictTo('Admin', 'Moderator'), deleteComment);

export { adminRouter }; 