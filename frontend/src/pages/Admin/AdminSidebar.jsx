import config from '../../config';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalPortal from '../../components/ModalPortal';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification';
import './Styles/AdminSidebar.css';

function AdminSidebar() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('${config.API_BASE_URL}/default-avatar.jpg');
  const [about, setAbout] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
    if (!userId) return;

    fetch(`${config.API_BASE_URL}/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name || 'Admin');
        setProfileImage(
          data.profileImage
            ? `${config.API_BASE_URL}${data.profileImage}`
            : '${config.API_BASE_URL}/default-avatar.jpg'
        );
        setAbout(data.about || '');
      })
      .catch(err => console.error("Failed to fetch user info:", err));
  }, []);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      setIsLoading(false);
      showNotification("Logout berhasil!", "success");
      navigate('/login');
    }, 1000);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !triggerRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userDropdownOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 8,
        left: rect.left + 10,
      });
    }
  }, [userDropdownOpen]);

  return (
    <div className="admin-sidebar">
      <LoadingOverlay isLoading={isLoading} />

      <h2 className="sidebar-title">Admin Dashboard</h2>

      <div
        className="admin-user-dropdown"
        onClick={toggleUserDropdown}
        ref={triggerRef}
      >
        <img src={profileImage} alt="👤" className="avatar-img" />
        <span className="user-name">{userName}</span>
      </div>

      {userDropdownOpen && (
        <ModalPortal>
          <div
            className="dropdown-menu"
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${dropdownStyle.top}px`,
              left: `${dropdownStyle.left}px`,
              zIndex: 9999,
            }}
          >
            <Link
              to="/admin/profile"
              className="dropdown-item"
              onClick={() => setUserDropdownOpen(false)}
            >
              Profile
            </Link>
            <button className="dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </ModalPortal>
      )}

      <ul className="sidebar-menu">
        <li><Link to="/admin/articles">Articles</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/comments">Comments</Link></li>
      </ul>

      {about && (
        <div className="admin-about-quote">
          <p>“{about}”</p>
        </div>
      )}
    </div>
  );
}

export default AdminSidebar;
