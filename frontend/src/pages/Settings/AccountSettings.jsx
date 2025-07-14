import React from 'react';
import './Styles/Settings.css';

function AccountSettings({ onClose }) {
  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <h2>Pengaturan Akun</h2>
        <form className="settings-form">
          <label>Email</label>
          <input type="email" defaultValue="user@example.com" />

          <label>Nama Lengkap</label>
          <input type="text" defaultValue="Nama User" />

          <div className="settings-buttons">
            <button type="submit">Simpan</button>
            <button className="close-icon" onClick={onClose} aria-label="Close" title="Tutup">✕</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccountSettings;