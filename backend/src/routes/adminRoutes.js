import express from 'express';
import {
  getAllPostsAdmin,
  deletePostAdmin,
  getAllUsers,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Apply both 'protect' and 'admin' middleware to all admin routes
router.use(protect, admin);

router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:id', deletePostAdmin);
router.get('/users', getAllUsers);

export default router;
