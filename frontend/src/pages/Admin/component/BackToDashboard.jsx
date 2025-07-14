// components/BackToDashboardButton.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../Styles/BackButton.css";
import { ArrowLeft } from 'lucide-react';

function BackToDashboardButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  // Tentukan apakah tombol ditampilkan
  const shouldShow =
    (path.startsWith('/admin') && path !== '/admin/dashboard') ||
    (path.startsWith('/author') && path !== '/author/dashboard');

  // Tentukan tujuan navigasi
  const getBackTarget = () => {
    if (path.startsWith('/admin')) return '/admin/dashboard';
    if (path.startsWith('/author')) return '/author/dashboard';
    return '/'; // fallback
  };

  if (!shouldShow) return null;

  return (
    <button className="back-button" onClick={() => navigate(getBackTarget())}>
      <ArrowLeft size={16} style={{ marginRight: 6 }} />
      Kembali ke Dashboard
    </button>
  );
}

export default BackToDashboardButton;
