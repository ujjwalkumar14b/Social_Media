import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myPosts, setMyPosts] = useState([]);

  const fetchMyPosts = async () => {
    try {
      const res = await API.get('/posts/me');
      setMyPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await API.delete(`/posts/${postId}`);
      setMyPosts(myPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  // Get user initial for profile avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h2 className="fw-bold mb-4">My Profile</h2>

      {/* User Info Header Card */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 me-3"
              style={{ width: '56px', height: '56px' }}
            >
              {userInitial}
            </div>
            <div>
              <h4 className="mb-0 fw-bold">{user?.name}</h4>
              <span className="badge bg-secondary text-capitalize mt-1">
                {user?.role || 'User'}
              </span>
            </div>
          </div>

          <div className="border-top pt-3 mt-3">
            <div className="row g-2">
              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Email Address</span>
                <span className="fw-semibold text-break">{user?.email}</span>
              </div>
              <div className="col-12 col-sm-6">
                <span className="text-muted small d-block">Account Status</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Posts Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h4 fw-bold mb-0">My Posts</h3>
        <span className="badge bg-primary rounded-pill px-3 py-2">
          {myPosts.length} {myPosts.length === 1 ? 'Post' : 'Posts'}
        </span>
      </div>

      {/* Posts List or Empty State */}
      {myPosts.length === 0 ? (
        <div className="text-center py-5 text-muted bg-white rounded shadow-sm">
          <p className="fs-5 mb-0">You haven't created any posts yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {myPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={() => {}}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;