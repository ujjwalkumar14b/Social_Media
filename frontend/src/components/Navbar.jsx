import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          SocialApp
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="navbar-nav align-items-center gap-lg-3 gap-2 mt-2 mt-lg-0">
            {token ? (
              <>
                <Link to="/" className="nav-link">
                  Feed
                </Link>
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>

                {/* Show Admin Dashboard link only if current user is an admin */}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link text-danger fw-bold">
                    Admin Panel
                  </Link>
                )}

                <span className="navbar-text text-secondary small">
                  ({user?.name})
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm px-3 ms-lg-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-sm ms-lg-2 px-3">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
