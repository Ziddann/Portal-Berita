import config from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../components/Notification'; // ⬅️ Pastikan ini bener
import './Styles/AuthorDashboard.css';

function AuthorSidebar() {
  const navigate = useNavigate();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState(`${config.API_BASE_URL}/default-avatar.jpg`);
  const [about, setAbout] = useState('');
  const dropdownRef = useRef(null);
  const { showNotification } = useNotification(); // ⬅️ Global notifikasi

  // Fetch user profile
  useEffect(() => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) return;

    fetch(`${config.API_BASE_URL}/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name || 'User');
        setProfileImage(
          data.profileImage
            ? `${config.API_BASE_URL}${data.profileImage}`
            : '${config.API_BASE_URL}/default-avatar.jpg'
        );
        setAbout(data.about || '');
      })
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);

  // Logout logic
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    showNotification('Logout berhasil!', 'success'); // 🎉
    setTimeout(() => navigate('/login'), 1500);
  };

  // Toggle dropdown
  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen((prev) => !prev);
  };

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="author-sidebar">
      <h3>Dashboard Author</h3>

      <div className="user-dropdown" onClick={toggleUserDropdown} ref={dropdownRef}>
        <img src={profileImage} alt="👤" className="avatar-img" />
        <span className="user-name">{userName}</span>

        {userDropdownOpen && (
          <div className="dropdown-menu">
            <Link
              to="/author/profile"
              className="dropdown-item"
              onClick={() => setUserDropdownOpen(false)}
            >
              Profile
            </Link>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

      <ul>
        <li><Link to="/author/dashboard">My Articles</Link></li>
        <li><Link to="/author/create-news">Create News</Link></li>
      </ul>

      {about && (
        <div className="author-quote">
          <p>“{about}”</p>
        </div>
      )}
    </div>
  );
}

export default AuthorSidebar;
