import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PostCard = ({ post, onDelete, onEdit }) => {
  const { user } = useContext(AuthContext);
  const isOwner = user?.id === post.author._id || user?.id === post.author;
  const isAdmin = user?.role === 'admin';
  const canDelete = isOwner || isAdmin;
  const authorName = post.author?.name || 'Unknown';
  const avatarInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-2" style={{ width: '38px', height: '38px' }}>
            {avatarInitial}
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{authorName}</h6>
          </div>
        </div>

        <p className="card-text text-secondary">{post.content}</p>

        {(isOwner || canDelete) && (
          <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-3">
            {isOwner && (
              <button onClick={() => onEdit(post)} className="btn btn-dark btn-sm px-3">
                Edit
              </button>
            )}
            {canDelete && (
              <button onClick={() => onDelete(post._id)} className="btn btn-dark btn-sm px-3">
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