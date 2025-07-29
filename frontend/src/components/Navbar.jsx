import config from '../config';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { useNotification } from './Notification';
import LoadingOverlay from './LoadingOverlay';
import './Styles/Navbar.css';
import './Styles/Sidebar.css';

function Navbar({ onSearch }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState('${config.API_BASE_URL}/default-avatar.jpg');
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');

    if (!token || !userId) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    fetch(`${config.API_BASE_URL}/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        const imageUrl = data.profileImage
          ? `${config.API_BASE_URL}${data.profileImage}`
          : `${config.API_BASE_URL}/default-avatar.jpg`;

        setProfileImage(imageUrl);
        setUserName(data.name || 'User');
        setRole(data.role || '');
      })
      .catch(err => {
        console.error("Error fetching user profile:", err);
      });
  }, []);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoading(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      sessionStorage.clear();
      setIsLoggedIn(false);
      setProfileImage('${config.API_BASE_URL}/default-avatar.jpg');
      setUserName('');
      setRole('');
      navigate('/');
      showNotification('Logout berhasil!', 'success');
      setIsLoading(false);
    }, 1000);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    setDropdownOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <nav className="navbar">
        <div className="navbar-left">
          {/* {isLoggedIn && (
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
          )} */}
          <Link to="/" className="logo-link" onClick={scrollToTop}>
            BrieflyNews
          </Link>
        </div>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <SearchBar />

              <Link to="/" className="nav-item" onClick={scrollToTop}>
                Home
              </Link>

              {role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-item">Admin Dashboard</Link>
              )}
              {role === 'author' && (
                <Link to="/author/dashboard" className="nav-item">Author Dashboard</Link>
              )}
              {role === 'reader' && (
                <Link to="/bookmark" className="nav-item">Bookmark</Link>
              )}

              <div className="dropdown user-dropdown" onClick={toggleUserDropdown}>
                <img src={profileImage} alt="" className="avatar-img" />
                {userDropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="nav-item">Register</Link>
            </>
          )}
        </div>
      </nav>

      {sidebarOpen && (
        <>
          <div className="sidebar-overlay" onClick={handleSidebarClose}></div>
          <Sidebar onClose={handleSidebarClose} />
        </>
      )}
    </>
  );
}

export default Navbar;
