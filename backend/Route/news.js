const express = require('express');
const router = express.Router();
const pool = require('../db');  // Pastikan koneksi ke MySQL sudah benar



// Example: /api/news/search?q=politik
router.get('/news/search', async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const [rows] = await pool.query(`
      SELECT n.*, 
        COUNT(DISTINCT nl.userId) AS likes, 
        COUNT(DISTINCT v.id) AS views
      FROM news n
      LEFT JOIN news_likes nl ON n.id = nl.newsId
      LEFT JOIN views v ON n.id = v.news_id
      WHERE n.title LIKE ?
      GROUP BY n.id
      ORDER BY n.id DESC
      LIMIT 20
    `, [`%${query}%`]);

    res.json(rows);
  } catch (err) {
    console.error("SQL error:", err);
    res.status(500).json({ message: "Search failed" });
  }
});





// Mengambil semua berita
router.get('/news', async (req, res) => {
  const query = `
    SELECT 
      n.*, 
      (SELECT COUNT(*) FROM news_likes WHERE newsId = n.id) AS likes,
      (SELECT COUNT(*) FROM views WHERE news_id = n.id) AS views
    FROM news n
    WHERE n.status = 'published'
    ORDER BY n.id DESC
  `;

  try {
    const [results] = await pool.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching news:', err);
    return res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Mengambil berita berdasarkan ID
router.get('/news/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil detail berita
    const [results] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'News not found' });

    }

    const newsDetail = results[0];

    // Ambil total likes
    const [likeRows] = await pool.query('SELECT COUNT(*) AS likes FROM news_likes WHERE newsId = ?', [id]);

    newsDetail.likes = likeRows[0].likes || 0;

    res.json(newsDetail);

  } catch (err) {
    console.error('Error fetching news by ID:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


// Menambahkan berita baru
router.post('/news', async (req, res) => {
  const { title, description, imageUrl, date, category, authorId } = req.body;

  if (!authorId) {
    return res.status(400).json({ message: 'Author ID is required' });
  }

  try {
    await pool.query(
      'INSERT INTO news (title, description, imageUrl, date, category, authorId) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, imageUrl, date, category, authorId]
    );

    res.json({ message: 'News created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create news' });
  }
});


// Mengambil berita trending (berita dengan jumlah komentar dan like terbanyak)
router.get('/trending', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT 
        n.id, 
        n.title, 
        n.imageUrl, 
        n.description, 
        DATE_FORMAT(n.date, '%d %M %Y') AS date,
        (SELECT COUNT(*) FROM news_likes WHERE newsId = n.id) AS totalLikes,
        (SELECT COUNT(*) FROM comments WHERE newsId = n.id) AS totalComments
      FROM news n
      WHERE n.status = 'published'
      ORDER BY totalLikes DESC, totalComments DESC
      LIMIT 5
    `);

    res.json(results);
  } catch (err) {
    console.error('Error fetching trending news:', err);
    res.status(500).json({ message: 'Gagal mengambil berita trending' });
  }
});

// GET berita berdasarkan kategori
router.get('/news/category/:category', async (req, res) => {
  const { category } = req.params;

  try {
    let query;
    let params = [];

    if (category === 'all') {
      // Ambil semua berita yang punya kategori dan sudah dipublish
      query = `
        SELECT * FROM news 
        WHERE category IS NOT NULL 
          AND category != '' 
          AND status = 'published'
        ORDER BY id DESC
      `;
    } else {
      // Ambil berita berdasarkan kategori dan status published
      query = `
        SELECT * FROM news 
        WHERE category = ? 
          AND status = 'published'
        ORDER BY id DESC
      `;
      params.push(category);
    }

    const [results] = await pool.query(query, params);
    res.json(results);
    
  } catch (err) {
    console.error('Error fetching news by category:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


// Record View
router.post('/news/:id/view', async (req, res) => {
  const newsId = req.params.id;
  const { userId } = req.body; 

  if (!userId) return res.status(400).json({ message: 'User ID required' });
  if (isNaN(newsId)) return res.status(400).json({ message: 'Invalid news ID' });

  try {
    const [check] = await pool.query(
      'SELECT * FROM views WHERE user_id = ? AND news_id = ?',
      [userId, newsId]
    );

    if (check.length === 0) {
      await pool.query('INSERT INTO views (user_id, news_id) VALUES (?, ?)', [userId, newsId]);
      // await pool.query('UPDATE news SET views = views + 1 WHERE id = ?', [newsId]);

      return res.json({ message: 'View recorded', viewed: true });
    }

    res.json({ message: 'Already viewed', viewed: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Total Views
router.get('/news/:id/views', async (req, res) => {
  const newsId = req.params.id;

  if (isNaN(newsId)) return res.status(400).json({ message: 'Invalid news ID' });

  try {
    const [result] = await pool.query('SELECT views FROM news WHERE id = ?', [newsId]);

    if (result.length === 0) return res.status(404).json({ message: 'News not found' });

    res.json({ totalViews: result[0].views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
