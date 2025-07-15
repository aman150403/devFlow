import { Router } from "express";

import { protect, restrictTo } from '../middlewares/auth.middleware.js'
import {
    deactivateUser,
    chnageUserRole,
    deleteAnswer,
    deleteComment,
    deleteQuestion,
    getAllUsers
} from "../controllers/admin.controller";

const adminRouter = Router()

adminRouter.patch('/user/role/:id', protect, restrictTo('admin'), chnageUserRole);
adminRouter.patch('/user/:id/deactivate', protect, restrictTo('admin'), deactivateUser);
adminRouter.get('/all-users', protect, restrictTo('admin'), getAllUsers);
adminRouter.delete('/question/:id', protect, restrictTo('admin', 'moderator'), deleteQuestion);
adminRouter.delete('/answer/:id', protect, restrictTo('admin', 'moderator'), deleteAnswer);
adminRouter.delete('/comment/:id', protect, restrictTo('admin', 'moderator'), deleteComment);

export { adminRouter }; 