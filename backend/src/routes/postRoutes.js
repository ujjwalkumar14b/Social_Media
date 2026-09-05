import express from 'express';
import {
  getPosts,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view feed
router.get('/', getPosts);

// Authenticated user routes
router.get('/me', protect, getMyPosts);
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

export default router;