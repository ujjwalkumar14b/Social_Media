import { useState, useEffect } from 'react';

const PostForm = ({ onSubmit, editingPost, clearEdit }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
    } else {
      setContent('');
    }
  }, [editingPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ content });
    setContent('');
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-3">
          {editingPost ? 'Edit Post' : 'Create a Post'}
        </h5>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Share your thoughts..."
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            {editingPost && (
              <button type="button" onClick={clearEdit} className="btn btn-dark px-4">
                Cancel
              </button>
            )}

            <button type="submit" className="btn btn-dark px-4 fw-semibold">
              {editingPost ? 'Update Post' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;