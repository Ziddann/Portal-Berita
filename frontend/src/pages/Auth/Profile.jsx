import config from '../../config';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification';

import './styles/Profile.css';

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    about: '',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const role = localStorage.getItem('role');
  const hideLayout = location.pathname.startsWith('/admin') || location.pathname.startsWith('/author');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    axios.get(`${config.API_BASE_URL}/api/users/${userId}`)
      .then(res => {
        const { name, email, about, profileImage } = res.data;
        setUserData({ name, email, about, profileImage });
        setProfileImagePreview(
          profileImage ? `${config.API_BASE_URL}${profileImage}` : '/default-avatar.png'
        );
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching user data:", err);
        setIsLoading(false);
        showNotification("Gagal memuat profil", 'error');
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({ ...prev, profileImage: file }));
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('about', userData.about);
    if (userData.profileImage instanceof File) {
      formData.append('profileImage', userData.profileImage);
    }

    const userId = localStorage.getItem('userId');

    try {
      const res = await axios.put(`${config.API_BASE_URL}/api/user/profile/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updated = res.data.user;
      localStorage.setItem('userName', updated.name);
      if (updated.profileImage) {
        localStorage.setItem('profileImage', updated.profileImage);
      }

      showNotification('Profil berhasil diperbarui!', 'success');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'author') {
          navigate('/author/dashboard');
        } else {
          navigate('/');
        }
      }, 1500);
    } catch (err) {
      console.error('Update failed:', err);
      showNotification('Gagal memperbarui profil. Silakan coba lagi.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingOverlay isLoading={true} />;

  return (
    <>
      {!hideLayout && <Navbar />}
      <div className="profile-page">
        <LoadingOverlay isLoading={isUpdating} />
        <div className="profile-container">
          <div className="profile-content">
            <img src={profileImagePreview} alt="Profile" className="profile-avatar" />
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="profileImage">Profile Picture</label>
                <input type="file" id="profileImage" onChange={handleImageChange} accept="image/*" />
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={userData.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="about">About</label>
                <textarea id="about" name="about" value={userData.about} onChange={handleChange} rows="4" />
              </div>

              <button type="submit" className="profile-submit-button">Update Profile</button>
            </form>
          </div>
        </div>
      </div>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Profile;
