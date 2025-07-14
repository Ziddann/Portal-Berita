import React from 'react';
import './Styles/Settings.css';

function SecuritySettings({ onClose }) {
  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>Keamanan</h2>
        <form className="settings-form">
          <label>Password Lama</label>
          <input type="password" placeholder="Masukkan password lama" />

          <label>Password Baru</label>
          <input type="password" placeholder="Masukkan password baru" />

          <label>Konfirmasi Password</label>
          <input type="password" placeholder="Ulangi password baru" />

          <div className="settings-buttons">
            <button type="submit">Ubah Password</button>
            <button className="close-icon" onClick={onClose} aria-label="Close" title="Tutup">✕</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SecuritySettings;