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
        <Link to="/" className="navbar-brand fw-bold fs-4"><i class="fa-solid fa-globe"></i></Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <div className="navbar-nav align-items-center gap-lg-3 gap-2 mt-2 mt-lg-0">
            {token ? (
              <>
                <Link to="/" className="nav-link"><i class="fa-solid fa-house"></i></Link>
                <Link to="/profile" className="nav-link"><i class="fa-solid fa-user"></i></Link>

                {user?.role === 'admin' && (
                  <Link to="/admin" className="nav-link"><i class="fa-solid fa-user-tie"></i></Link>
                )}

                <button onClick={handleLogout} className="nav-link"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
              </>
            ) : (
              <>
                <Link to="/guest" className='nav-link'>Join as Guest</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
