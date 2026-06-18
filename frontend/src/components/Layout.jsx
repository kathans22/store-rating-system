import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRole } from '../utils/validation';

export default function Layout({ children, title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <p className="brand">Store Ratings Platform</p>
            {title && <h1 className="page-title">{title}</h1>}
          </div>
          <div className="topbar-actions">
            <span className="user-badge">
              {user.name} · {formatRole(user.role)}
            </span>
            <Link to="/password" className="btn btn-secondary">
              Update Password
            </Link>
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
