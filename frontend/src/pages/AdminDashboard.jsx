import { useState, useEffect } from 'react';
import API from '../services/api';
import PostCard from '../components/PostCard';

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);

  const fetchAllPosts = async () => {
    try {
      const res = await API.get('/admin/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts for admin:', err);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleAdminDelete = async (postId) => {
    try {
      await API.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Admin failed to delete post:', err);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      {/* Header Banner */}
      <div className="card bg-danger text-white border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="card-title fw-bold mb-1">Admin Moderation Panel</h2>
              <p className="card-text mb-0 opacity-75">
                Monitor and moderate content across the platform
              </p>
            </div>
            <span className="badge bg-light text-danger fs-6 px-3 py-2 rounded-pill fw-bold">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm">
          <p className="fs-5 mb-0">No posts found to moderate.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={() => {}}
              onDelete={handleAdminDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
