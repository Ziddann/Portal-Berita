import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AccountSettings from '../pages/Settings/AccountSettings';
import PreferencesSettings from '../pages/Settings/PreferencesSettings';
import SecuritySettings from '../pages/Settings/SecuritySettings';
import './Styles/Sidebar.css';
import '../pages/Settings/Styles/Settings.css';

function Sidebar({ onClose }) {
  const [popup, setPopup] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek apakah pengguna sudah login berdasarkan keberadaan token di localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Jika token ada, pengguna dianggap sudah login
    }
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Hapus token dari localStorage
    setIsLoggedIn(false); // Update status login
    alert('You have logged out successfully');
  };

  const closePopup = () => setPopup(null);

  return (
    <>
      <aside className="sidebar">
        <button className="sidebar-close" onClick={onClose}>✕</button>

        <h3>Pengaturan</h3>
        <ul>
          <li><span className="sidebar-link" style={{ cursor: 'pointer' }} onClick={() => setPopup('akun')}>Akun</span></li>
          <li><span className="sidebar-link" style={{ cursor: 'pointer' }} onClick={() => setPopup('preferensi')}>Preferensi</span></li>
          <li><span className="sidebar-link" style={{ cursor: 'pointer' }} onClick={() => setPopup('keamanan')}>Keamanan</span></li>
          
          {/* Jika sudah login, tampilkan tombol Logout */}
          {isLoggedIn ? (
            <li><span className="sidebar-link" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</span></li>
          ) : (
            <li><Link to="/login" className="sidebar-link" style={{ cursor: 'pointer' }}>Login</Link></li>
          )}
        </ul>
      </aside>

      {popup === 'akun' && <AccountSettings onClose={closePopup} />}
      {popup === 'preferensi' && <PreferencesSettings onClose={closePopup} />}
      {popup === 'keamanan' && <SecuritySettings onClose={closePopup} />}
    </>
  );
}

export default Sidebar;
