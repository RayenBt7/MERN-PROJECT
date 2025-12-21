import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaCog, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, isCollapsed, onToggle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <h2>NeuroFlix</h2>}
        <button className="collapse-btn" onClick={onToggle}>
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      <Link to="/profile" className="profile-btn">
        <span className="icon-wrapper"><FaUser /></span>
        {!isCollapsed && <span>My Profile</span>}
      </Link>
      <ul>
        <li>
          <Link to="/home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="icon-wrapper"><FaHome /></span>
            {!isCollapsed && <span>Home</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <span className="icon-wrapper"><FaCog /></span>
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </li>
        <li>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
            <span className="icon-wrapper"><FaSignOutAlt /></span>
            {!isCollapsed && <span>Logout</span>}
          </a>
        </li>
      </ul>
    </div>
  );
}