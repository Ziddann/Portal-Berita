const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asumsi koneksi pool udah siap

// Endpoint Total Statistik Dashboard
router.get('/stats', async (req, res) => {
  try {
    const [articles] = await pool.query('SELECT COUNT(*) AS total FROM news');
    const [users] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [views] = await pool.query('SELECT COUNT(*) AS total FROM views'); 
    const [comments] = await pool.query('SELECT COUNT(*) AS total FROM comments');

    res.json({
      totalArticles: articles[0].total,
      totalUsers: users[0].total,
      totalPageViews: views[0].total || 0, // Default ke 0 kalau null
      totalComments: comments[0].total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});



// GET /api/reports
router.get('/reports', async (req, res) => {
try {
  const [rows] = await pool.query(`
    SELECT 
      r.id, r.targetType, r.targetId, r.reason, r.note, r.createdAt,
      u.name AS reporterName, u.email AS reporterEmail,
      CASE
        WHEN r.targetType = 'news' THEN (SELECT title FROM news WHERE id = r.targetId)
        WHEN r.targetType = 'comment' THEN (SELECT commentText FROM comments WHERE id = r.targetId)
        ELSE NULL
      END AS reportedContent
    FROM reports r
    JOIN users u ON r.reporterId = u.id
    ORDER BY r.createdAt DESC
    LIMIT 10;
  `);

  res.json(rows);
} catch (err) {
  console.error("Gagal ambil laporan:", err);
  res.status(500).json({ error: 'Gagal mengambil laporan', details: err.message });
}
});

// Delete news
router.delete('/news/:id', async (req, res) => {
  await pool.query("DELETE FROM news WHERE id = ?", [req.params.id]);
  res.sendStatus(204);
});

// Delete comment
router.delete('/comment/:id', async (req, res) => {
  await pool.query("DELETE FROM comments WHERE id = ?", [req.params.id]);
  res.sendStatus(204);
});

// Hapus laporan berdasarkan ID
router.delete('/reports/:id', async (req, res) => {
  const reportId = req.params.id;

  try {
    await pool.query('DELETE FROM reports WHERE id = ?', [reportId]);
    res.json({ success: true, message: 'Laporan berhasil dihapus' });
  } catch (err) {
    console.error("Gagal menghapus laporan:", err);
    res.status(500).json({ error: 'Gagal menghapus laporan' });
  }
});

router.get('/news/all', async (req, res) => {
  const query = `
    SELECT 
      n.*, 
      u.name AS authorName,
      (SELECT COUNT(*) FROM news_likes WHERE newsId = n.id) AS likes,
      (SELECT COUNT(*) FROM views WHERE news_id = n.id) AS views
    FROM news n
    LEFT JOIN users u ON n.authorId = u.id
    ORDER BY n.id DESC
  `;

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching all news:', err);
    return res.status(500).json({ error: 'Failed to fetch all news' });
  }
});


router.put('/news/:id', async (req, res) => {
  const newsId = req.params.id;
  const { title, description, imageUrl, category, status } = req.body;

  try {
    await pool.query(
      'UPDATE news SET title = ?, description = ?, imageUrl = ?, category = ?, status = ? WHERE id = ?',
      [title, description, imageUrl, category, status, newsId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating news' });
  }
});

// GET semua user
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,

        -- Jumlah komentar oleh user ini
        COALESCE(comment_stats.commentCount, 0) AS commentCount,

        -- Jumlah like yang diberikan user ini ke berita
        COALESCE(like_stats.totalLikes, 0) AS totalLikes,

        -- Jumlah view yang dilakukan user ini ke berita
        COALESCE(view_stats.totalViews, 0) AS totalViews,

        -- Jumlah berita yang ditulis (jika role author)
        COALESCE(news_count.totalNews, 0) AS newsCount

      FROM users u

      -- JOIN komentar
      LEFT JOIN (
        SELECT userId, COUNT(*) AS commentCount
        FROM comments
        GROUP BY userId
      ) AS comment_stats ON u.id = comment_stats.userId

      -- JOIN like yang DILAKUKAN oleh user
      LEFT JOIN (
        SELECT userId, COUNT(*) AS totalLikes
        FROM news_likes
        GROUP BY userId
      ) AS like_stats ON u.id = like_stats.userId

      -- JOIN view yang DILAKUKAN oleh user
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS totalViews
        FROM views
        GROUP BY user_id
      ) AS view_stats ON u.id = view_stats.user_id

      -- JOIN berita yang ditulis user
      LEFT JOIN (
        SELECT authorId, COUNT(*) AS totalNews
        FROM news
        GROUP BY authorId
      ) AS news_count ON u.id = news_count.authorId

      ORDER BY u.id DESC
    `);

    res.json(users);
  } catch (err) {
    console.error("Gagal mengambil data users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ success: true });
  } catch (err) {
    console.error("Error update role:", err);
    res.status(500).json({ success: false, message: "Gagal update role" });
  }
});

// DELETE user by ID
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // 1. Hapus semua komentar milik user
    await pool.query('DELETE FROM comments WHERE userId = ?', [userId]);

    // 2. Hapus semua berita milik user
    await pool.query('DELETE FROM news WHERE authorId = ?', [userId]);

    // 3. (Opsional) Hapus likes atau data lain yg terkait
    await pool.query('DELETE FROM news_likes WHERE userId = ?', [userId]);
    await pool.query('DELETE FROM reports WHERE reporterId = ?', [userId]);

    // 4. Hapus user-nya
    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.status(200).json({ success: true, message: 'User & data terkait berhasil dihapus' });
  } catch (err) {
    console.error("Gagal menghapus user:", err);
    res.status(500).json({ success: false, message: 'Gagal menghapus user' });
  }
});

// GET semua komentar untuk admin
router.get("/comments/all", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.commentText, c.createdAt, c.parentId, c.newsId,
             u.name AS username, u.profileImage,
             n.title AS newsTitle
      FROM comments c
      LEFT JOIN users u ON c.userId = u.id
      LEFT JOIN news n ON c.newsId = n.id
      ORDER BY c.createdAt DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error get all comments:", err);
    res.status(500).json({ message: "Gagal mengambil komentar" });
  }
});

// DELETE komentar by ID (admin only)
router.delete("/comments/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    await pool.query("DELETE FROM comments WHERE id = ?", [commentId]);
    res.json({ message: "Komentar berhasil dihapus" });
  } catch (err) {
    console.error("Error delete comment:", err);
    res.status(500).json({ message: "Gagal menghapus komentar" });
  }
});

// Ubah status berita
router.put('/news/:id/status', async (req, res) => {
  const newsId = req.params.id;
  const { status } = req.body;

  try {
    // Validasi status
    if (!['Published', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid' });
    }

    const [result] = await pool.query(
      'UPDATE news SET status = ? WHERE id = ?',
      [status, newsId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    res.json({ success: true, message: `Status berita diubah ke ${status}` });
  } catch (error) {
    console.error('Gagal update status berita:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
