const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');  // Mengimpor pool untuk koneksi MySQL

// Route untuk registrasi pengguna
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const adminEmail = 'admin@example.com';
  try {
    // Cek apakah email sudah terdaftar
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    let userRole = 'reader'; 
    if (email === adminEmail) {
      userRole = 'admin';
    } else if (role && (role === 'author' || role === 'reader')) {
      userRole = role;
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna baru ke dalam database
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [name, email, hashedPassword, userRole]);

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route untuk login pengguna
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cek apakah email ada di database
    const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Buat JWT token dan sertakan role
    const token = jwt.sign({ userId: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.json({ token, role: user.role, userId: user.id, profileImage: user.profileImage });

  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
