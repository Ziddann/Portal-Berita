import config from '../../config';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification'; // ✅
import './styles/Register.css';

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // ✅

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      showNotification('Anda harus menyetujui Syarat & Ketentuan!', 'error');
      return;
    }

    if (form.password !== form.confirmPassword) {
      showNotification('Password tidak cocok!', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: 'reader',
        }),
      });

      const data = await response.json();

      if (data.message) {
        showNotification('Registrasi berhasil! Silakan login.', 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showNotification('Pendaftaran gagal. Coba lagi.', 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Terjadi kesalahan saat mendaftar.', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <LoadingOverlay isLoading={isLoading} />

      <form className="register-box" onSubmit={handleSubmit}>
        <div className="register-icon-logo">📰</div>
        <h1 className="register-title">NewsPortal</h1>
        <p className="register-subtitle">Bergabung dengan komunitas berita terdepan</p>

        <h2 className="register-form-title">Daftar Akun</h2>
        <p className="register-form-desc">Dapatkan akses ke berita terkini dan eksklusif</p>

        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="email"
          name="email"
          placeholder="nama@email.com"
          value={form.email}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={handleChange}
          required
          className="register-input"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Ulangi password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="register-input"
        />

        <div className="register-checkbox-group">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            id="agree"
          />
          <label htmlFor="agree">
            Saya setuju dengan <a href="#">Syarat & Ketentuan</a> dan <a href="#">Kebijakan Privasi</a>
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isLoading}>
          Daftar Sekarang
        </button>

        <div className="register-divider">atau</div>

        <p className="register-login-link">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
