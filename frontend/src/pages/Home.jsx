import { useState, useEffect } from 'react';
import API from '../services/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Create or Update Post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPostId) {
        await API.put(`/posts/${editingPostId}`, { title, content });
        setEditingPostId(null);
      } else {
        await API.post('/posts', { title, content });
      }
      setTitle('');
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error('Failed to save post:', err);
    }
  };

  // Set form state for editing
  const handleEdit = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
  };

  // Delete post
  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>

      {/* Post Create/Edit Form */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <h5 className="card-title fw-bold mb-3">
            {editingPostId ? 'Edit Post' : 'Create Post'}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="What's on your mind?"
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              {editingPostId && (
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => {
                    setEditingPostId(null);
                    setTitle('');
                    setContent('');
                  }}
                >
                  Cancel
                </button>
              )}

              <button type="submit" className="btn btn-primary px-4 fw-semibold">
                {editingPostId ? 'Update Post' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Post List */}
      {posts.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm">
          <p className="fs-5 mb-0">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;