const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asumsi koneksi pool udah siap

// Misalnya file: routes/news.js
router.get('/news/mine', async (req, res) => {
    const userId = req.query.userId; // ambil dari query string (frontend kirim)
  
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
  
    try {
      const [rows] = await pool.query('SELECT * FROM news WHERE authorId = ?', [userId]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengambil berita author' });
    }
  });

// GET single news
router.get('/news/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update news
router.put('/news/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, date, category } = req.body;

  try {
    const [check] = await pool.query('SELECT status FROM news WHERE id = ?', [id]);
    if (!check.length || check[0].status.toLowerCase() === 'published') {
      return res.status(403).json({ success: false, message: 'Berita sudah dipublikasikan' });
    }

    await pool.query(
      'UPDATE news SET title = ?, description = ?, imageUrl = ?, date = ?, category = ? WHERE id = ?',
      [title, description, imageUrl, date, category, id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating:', err);
    res.status(500).json({ success: false });
  }
});

  
// DELETE /api/news/:id
router.delete('/news/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query('DELETE FROM news WHERE id = ?', [id]);
      res.json({ success: true, message: 'News deleted' });
    } catch (err) {
      console.error('Error deleting news:', err);
      res.status(500).json({ success: false, message: 'Failed to delete news' });
    }
  });
  
// PUT /api/news/status/:id
router.put('/news/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await pool.query('UPDATE news SET status = ? WHERE id = ?', [status, id]);
      res.json({ success: true, message: 'Status updated' });
    } catch (err) {
      console.error('Error updating status:', err);
      res.status(500).json({ success: false, message: 'Failed to update status' });
    }
  });

module.exports = router;
