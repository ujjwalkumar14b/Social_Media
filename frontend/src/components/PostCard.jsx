import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PostCard = ({ post, onDelete, onEdit }) => {
  const { user } = useContext(AuthContext);

  // Check if current user is the owner OR an admin
  const isOwner = user?.id === post.author._id || user?.id === post.author;
  const isAdmin = user?.role === 'admin';
  const canDelete = isOwner || isAdmin;

  // Get author initial for avatar placeholder
  const authorName = post.author?.name || 'Unknown';
  const avatarInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        {/* Author Header */}
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-2" style={{ width: '38px', height: '38px' }}>
            {avatarInitial}
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{authorName}</h6>
            {isAdmin && !isOwner && (
              <span className="badge bg-warning text-dark me-1">Admin View</span>
            )}
          </div>
        </div>

        {/* Post Title & Content */}
        <h5 className="card-title fw-bold mb-2">{post.title}</h5>
        <p className="card-text text-secondary">{post.content}</p>

        {/* Action Buttons */}
        {(isOwner || canDelete) && (
          <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-3">
            {/* Only post owners can edit their posts */}
            {isOwner && (
              <button 
                onClick={() => onEdit(post)} 
                className="btn btn-outline-secondary btn-sm px-3"
              >
                Edit
              </button>
            )}

            {/* Either the post owner OR an admin can delete */}
            {canDelete && (
              <button
                onClick={() => onDelete(post._id)}
                className="btn btn-outline-danger btn-sm px-3"
              >
                {isAdmin && !isOwner ? 'Delete (Admin)' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;