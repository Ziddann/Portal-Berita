const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

// Ambil data user untuk halaman profile
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT name, email, about, profileImage, role FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    user.profileImage = user.profileImage
      ? `/uploads/${user.profileImage}`
      : '/default-avatar.png';

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update profile user
router.put('/user/profile/:id', upload.single('profileImage'), async (req, res) => {
  const { id } = req.params;
  const { name, email, about } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  console.log("=== DEBUG UPDATE PROFILE ===");
  console.log("ID:", id);
  console.log("Name:", name);
  console.log("Email:", email);
  console.log("About:", about);
  console.log("Uploaded Image:", profileImage);

  try {
    if (profileImage) {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, about = ?, profileImage = ? WHERE id = ?',
        [name, email, about, profileImage, id]
      );
    } else {
      await pool.query(
        'UPDATE users SET name = ?, email = ?, about = ? WHERE id = ?',
        [name, email, about, id]
      );
    }

    const [updatedUser] = await pool.query(
      'SELECT id, name, email, about, profileImage FROM users WHERE id = ?',
      [id]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = updatedUser[0];
    user.profileImage = user.profileImage
      ? `/uploads/${user.profileImage}`
      : '/default-avatar.png';

    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
