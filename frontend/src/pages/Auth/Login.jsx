import config from '../../config';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification';
import './Styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', data.token);
        storage.setItem('userId', data.userId);
        storage.setItem('role', data.role);
        storage.setItem('profileImage', data.profileImage);

        showNotification('Login berhasil!', 'success');

        setTimeout(() => {
          navigate(
            data.role === 'admin'
              ? '/admin/dashboard'
              : data.role === 'author'
              ? '/author/dashboard'
              : '/'
          );
        }, 1500);
      } else {
        showNotification('Email atau password salah.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Terjadi kesalahan saat login. Silakan coba lagi.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoadingOverlay isLoading={isLoading} />

      <div className="login-container">
        {/* Kolom kiri */}
        <div className="left-column">
          <h1>BrieflyNews</h1>
          <p>Tetap Terdepan dengan Berita Terkini</p>
          <p>Platform berita terpercaya yang menghadirkan informasi akurat dan terkini dari seluruh dunia</p>
          <div className="features">
            <div className="feature">Real-time Updates</div>
            <div className="feature">Global Coverage</div>
          </div>
        </div>

        {/* Formulir Login */}
        <form className="login-box" onSubmit={handleSubmit}>
          <h2>Selamat Datang Kembali</h2>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <div className="checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              disabled={isLoading}
            />
            <label htmlFor="rememberMe">Ingat saya</label>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            Masuk
          </button>

          <p className="forgot-password">
            <Link to="/forgot-password">Lupa password?</Link>
          </p>

          <div className="register-link">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
