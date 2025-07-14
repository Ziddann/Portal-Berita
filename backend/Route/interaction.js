// routes/newsActions.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cek status Like
router.get('/news/:newsId/liked/:userId', async (req, res) => {
  const { newsId, userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM news_likes WHERE userId = ? AND newsId = ?', [userId, newsId]);
    res.json({ liked: rows.length > 0 });
  } catch (err) {
    console.error('Error checking like status:', err);
    res.status(500).json({ liked: false });
  }
});

// Cek status Bookmark
router.get('/news/:newsId/bookmarked/:userId', async (req, res) => {
  const { newsId, userId } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM bookmarks WHERE userId = ? AND newsId = ?', [userId, newsId]);
    res.json({ bookmarked: rows.length > 0 });
  } catch (err) {
    console.error('Error checking bookmark status:', err);
    res.status(500).json({ bookmarked: false });
  }
});

// Toggle Like
router.post("/news/:newsId/like", async (req, res) => {
    const { newsId } = req.params;
    const { userId } = req.body;
  
    if (!userId) return res.status(400).json({ message: "User tidak ditemukan" });
  
    try {
      // Cek apakah sudah like
      const [rows] = await pool.query("SELECT * FROM news_likes WHERE newsId = ? AND userId = ?", [newsId, userId]);
  
      if (rows.length > 0) {
        // Sudah like, maka unlike
        await pool.query("DELETE FROM news_likes WHERE newsId = ? AND userId = ?", [newsId, userId]);
        const [count] = await pool.query("SELECT COUNT(*) AS totalLikes FROM news_likes WHERE newsId = ?", [newsId]);
        return res.json({ success: true, liked: false, likes: count[0].totalLikes });
      } else {
        // Belum like, maka like
        await pool.query("INSERT INTO news_likes (newsId, userId) VALUES (?, ?)", [newsId, userId]);
        const [count] = await pool.query("SELECT COUNT(*) AS totalLikes FROM news_likes WHERE newsId = ?", [newsId]);
        return res.json({ success: true, liked: true, likes: count[0].totalLikes });
      }
    } catch (err) {
      console.error("Error like news:", err);
      res.status(500).json({ message: "Gagal like berita" });
    }
  });
  
  

// Toggle Bookmark
router.post('/news/:newsId/bookmark', async (req, res) => {
  const { newsId } = req.params;
  const { userId } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM bookmarks WHERE userId = ? AND newsId = ?', [userId, newsId]);

    if (rows.length > 0) {
      // Sudah bookmark, maka hapus
      await pool.query('DELETE FROM bookmarks WHERE userId = ? AND newsId = ?', [userId, newsId]);
      return res.json({ success: true, bookmarked: false });
    } else {
      // Belum bookmark, maka tambahkan
      await pool.query('INSERT INTO bookmarks (userId, newsId) VALUES (?, ?)', [userId, newsId]);
      return res.json({ success: true, bookmarked: true });
    }
  } catch (err) {
    console.error('Error toggling bookmark:', err);
    res.status(500).json({ success: false });
  }
});

router.get('/bookmarks/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const [rows] = await pool.query(`
        SELECT n.id, n.title, n.imageUrl, n.description, n.date
        FROM bookmarks b
        JOIN news n ON b.newsId = n.id
        WHERE b.userId = ?
        ORDER BY b.id DESC
      `, [userId]);
  
      res.json(rows);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      res.status(500).json({ success: false, message: 'Gagal mengambil bookmark' });
    }
  });
  
  router.post("/reports", async (req, res) => {
    const { reporterId, targetType, targetId, reason, note } = req.body;
  
    try {
      await pool.query(
        `INSERT INTO reports (reporterId, targetType, targetId, reason, note) VALUES (?, ?, ?, ?, ?)`,
        [reporterId, targetType, targetId, reason, note || null]
      );
      res.status(201).json({ message: "Laporan berhasil dikirim" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Gagal mengirim laporan" });
    }
  });
  





module.exports = router;
