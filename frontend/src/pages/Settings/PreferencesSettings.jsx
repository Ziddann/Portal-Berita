import React, { useState, useEffect } from 'react';
import './Styles/Settings.css';

function PreferencesSettings({ onClose }) {
  // Menyimpan state untuk tema dan bahasa
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'id');

  // Menyimpan preferensi ke localStorage dan mengubah tema halaman
  useEffect(() => {
    // Mengatur tema (light/dark mode)
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Menyimpan preferensi tema dan bahasa ke localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('language', language);
  }, [theme, language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pilihan sudah disimpan otomatis di useEffect dan localStorage
    onClose();  // Menutup modal setelah preferensi disimpan
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>Preferensi</h2>
        <form className="settings-form" onSubmit={handleSubmit}>
          <label>Tema</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Terang</option>
            <option value="dark">Gelap</option>
          </select>

          <label>Bahasa</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>

          <div className="settings-buttons">
            <button type="submit">Simpan</button>
            <button type="button" className="close-icon" onClick={onClose} aria-label="Close" title="Tutup">
              ✕
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PreferencesSettings;
