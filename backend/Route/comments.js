const express = require('express');
const router = express.Router();
const pool = require('../db'); // Koneksi database

// Tambah Komentar
router.post('/comments', async (req, res) => {
  const { userId, newsId, commentText } = req.body;

  if (!userId || !newsId || !commentText) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO comments (userId, newsId, commentText, createdAt) VALUES (?, ?, ?, NOW())',
      [userId, newsId, commentText]
    );

    res.json({ message: 'Comment added successfully', commentId: result.insertId });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// Balas Komentar
router.post("/comments/reply", async (req, res) => {
  const { userId, newsId, commentText, parentId, replyToUser } = req.body;

  try {
    await pool.query(`
      INSERT INTO comments (newsId, userId, parentId, commentText, replyToUser, createdAt)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [newsId, userId, parentId || null, commentText, replyToUser || null]);

    res.status(201).json({ message: "Komentar berhasil ditambahkan" });
  } catch (err) {
    console.error("Gagal menambahkan komentar:", err);
    res.status(500).json({ error: "Gagal menambahkan komentar" });
  }
});


// Ambil Komentar Berdasarkan Berita
router.get('/comments/:newsId', async (req, res) => {
  const newsId = req.params.newsId;

  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.commentText, c.createdAt, c.parentId, c.likes, c.dislikes,
             c.replyToUser,
             u.name AS username, u.profileImage
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.newsId = ?
      ORDER BY c.createdAt ASC
    `, [newsId]);

    const comments = rows.map(c => ({
      ...c,
      id: Number(c.id),
      parentId: c.parentId !== null ? Number(c.parentId) : null,
      profileImage: c.profileImage
      ? `/uploads/${c.profileImage}`
      : '/default-avatar.png'
    }));

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal ambil komentar" });
  }
});

// Like/Dislike Komentar
router.post("/comments/:commentId/react", async (req, res) => {
  const { commentId } = req.params;
  const { userId, action } = req.body;

  if (!['like', 'dislike'].includes(action)) {
    return res.status(400).json({ error: "Aksi tidak valid" });
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM comment_likes WHERE commentId = ? AND userId = ?",
      [commentId, userId]
    );

    if (existing.length > 0) {
      const currentStatus = existing[0].status;

      if (currentStatus === action) {
        await pool.query("DELETE FROM comment_likes WHERE commentId = ? AND userId = ?", [commentId, userId]);
        const field = action === 'like' ? 'likes' : 'dislikes';
        await pool.query(`UPDATE comments SET ${field} = ${field} - 1 WHERE id = ?`, [commentId]);

        return res.json({ success: true, liked: false, disliked: false });
      } else {
        await pool.query(
          "UPDATE comment_likes SET status = ? WHERE commentId = ? AND userId = ?",
          [action, commentId, userId]
        );

        if (action === 'like') {
          await pool.query("UPDATE comments SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = ?", [commentId]);
        } else {
          await pool.query("UPDATE comments SET dislikes = dislikes + 1, likes = likes - 1 WHERE id = ?", [commentId]);
        }

        return res.json({ success: true, liked: action === 'like', disliked: action === 'dislike' });
      }
    } else {
      await pool.query(
        "INSERT INTO comment_likes (commentId, userId, status) VALUES (?, ?, ?)",
        [commentId, userId, action]
      );

      const field = action === 'like' ? 'likes' : 'dislikes';
      await pool.query(`UPDATE comments SET ${field} = ${field} + 1 WHERE id = ?`, [commentId]);

      return res.json({ success: true, liked: action === 'like', disliked: action === 'dislike' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
