// components/BeritaTerbaru.jsx
import config from '../../config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/BeritaTerbaru.css';

const BeritaTerbaru = () => {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/news`)
      .then((response) => response.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => b.id - a.id);
        setNewsList(sortedData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="berita-container">
      <div className="berita-header">
        <h2>Berita Terbaru</h2>
        <a href="/berita" className="lihat-semua">Lihat Semua</a>
      </div>
      <div className="berita-grid">
        {newsList.slice(0, 3).map((news) => (
          <Link to={`/news/${news.id}`} key={news.id} className="berita-card">
            <img src={news.imageUrl} alt={news.title} className="berita-img" />
            <div className="berita-content">
              <div className="berita-meta">
                <span className="berita-tag">{news.category || 'Berita'}</span>
                <span className="berita-time">{new Date(news.date).toLocaleDateString('id-ID')}</span>
              </div>
              <h3 className="berita-title">{news.title}</h3>
              <p className="berita-desc">{news.description}</p>
              <div className="berita-author">Admin</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BeritaTerbaru;
