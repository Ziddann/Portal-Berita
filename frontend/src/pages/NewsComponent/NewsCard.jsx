// components/NewsCard.jsx
import config from '../../config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/NewsCard.css';

const NewsCard = () => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/news`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => b.id - a.id);
        setNewsList(sorted);
      })
      .catch((err) => console.error('Error:', err));
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = newsList.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  return (
    <div className="news-section">
      <h2 className="news-section-title">Semua Berita</h2>

      <div className="news-card-grid">
        {paginatedNews.map((news) => (
          <Link to={`/news/${news.id}`} className="news-card" key={news.id}>
            <img src={news.imageUrl} alt={news.title} className="news-image" />
            <div className="news-content">
              <span className="news-category">{news.category?.toUpperCase() || 'BERITA'}</span>
              <h3 className="news-title">{news.title}</h3>
              <div className="news-card-footer">
  {/* <div className="news-footer-left">
    <span>{new Date(news.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  </div> */}
  <div className="news-footer-right">
    <span>👍 {news.likes || 0}</span>
    <span>👁 {news.views || 0}</span>
  </div>
</div>

            </div>
          </Link>
        ))}
      </div>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`pagination-button ${i + 1 === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
