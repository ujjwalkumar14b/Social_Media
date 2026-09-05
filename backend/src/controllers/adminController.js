import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Get all posts for admin moderation
// @route   GET /api/admin/posts
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin delete any post
// @route   DELETE /api/admin/posts/:id
export const deletePostAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted by Admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users (Admin only)
// @route   GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
