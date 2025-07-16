// components/AllNews.jsx
import config from '../../config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/AllNews.css';

const AllNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
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
  const paginatedNews = showAll ? newsList : newsList.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  const handleToggleView = () => {
    setShowAll((prev) => !prev);
    if (showAll) setCurrentPage(1); // balik ke page 1 pas nutup
  };

  return (
    <div className="all-news-section">
      <h2 className="all-news-title">Semua Berita</h2>

      <div className="all-news-grid">
        {paginatedNews.map((news) => (
          <Link to={`/news/${news.id}`} className="all-news-card" key={news.id}>
            <img src={news.imageUrl} alt={news.title} className="all-news-image" />
            <div className="all-news-content">
              <span className="all-news-category">{news.category?.toUpperCase() || 'BERITA'}</span>
              <h3 className="all-news-title-text">{news.title}</h3>
              <div className="all-news-footer">
                <div className="news-footer-right">
                  <span>👍 {news.likes || 0}</span>
                  <span>👁 {news.views || 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="all-news-controls">
        {!showAll && (
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
        )}

        <button className="show-all-button" onClick={handleToggleView}>
          {showAll ? 'Tutup Semua' : 'Tampilkan Semua'}
        </button>
      </div>
    </div>
  );
};

export default AllNews;
