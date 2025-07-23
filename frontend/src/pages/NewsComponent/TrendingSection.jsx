import config from '../../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Styles/TrendingSection.css';

function TrendingSection() {
  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/trending`)
      .then((res) => res.json())
      .then((data) => setTrendingNews(data))
      .catch((err) => console.error('Error fetching trending news:', err));
  }, []);

  if (trendingNews.length === 0) {
    return <p>Belum ada berita trending.</p>;
  }

  const [highlight, ...restNews] = trendingNews;

  return (
    <div className="trending-container">
      
      {/* Headline Besar dengan Gambar */}
      <div className="highlight-section">
        <Link to={`/news/${highlight.id}`} className="highlight-link">
          <img
            src={highlight.imageUrl}
            alt={highlight.title}
            className="highlight-image"
          />
          <div className="highlight-content">
            <span className="highlight-badge">🔥 BREAKING NEWS</span>
            <h2 className="highlight-title">{highlight.title}</h2>
            <p className="highlight-desc">{highlight.description}</p>
            <p className="highlight-date">{highlight.date}</p>
          </div>
        </Link>
      </div>

      {/* List Kanan */}
      <div className="side-list">
        {restNews.slice(0, 3).map((news) => (
          <Link key={news.id} to={`/news/${news.id}`} className="side-item">
            <div className="side-thumb">
              <img src={news.imageUrl} alt={news.title} />
            </div>
            <div className="side-info">
              <h4 className="side-title">{news.title}</h4>
              <p className="side-date">{news.date}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}

export default TrendingSection;
