import { useState, useEffect } from 'react';

const PostForm = ({ onSubmit, editingPost, clearEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Populate input fields if an editingPost object is provided
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle('');
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
            {editingPost && (
              <button
                type="button"
                onClick={clearEdit}
                className="btn btn-outline-secondary px-4"
              >
                Cancel
              </button>
            )}

            <button type="submit" className="btn btn-primary px-4 fw-semibold">
              {editingPost ? 'Update Post' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;