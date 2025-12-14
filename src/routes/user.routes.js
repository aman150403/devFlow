import { Router } from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import {
    deleteUserProfile,
    getAllUsers,
    getPublicProfileStats,
    getUserProfile,
    updateUserProfile,
    getUserActivity
} from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.get('/profile', protect, getUserProfile);
userRouter.put('/update-profile', protect, updateUserProfile);
userRouter.delete('/delete-profile', protect, deleteUserProfile);
userRouter.get('/all-users', protect, restrictTo('Admin'), getAllUsers);
userRouter.get('/public/:id', getPublicProfileStats);
userRouter.get('/user-activity/:id', protect, getUserActivity);

export { userRouter }