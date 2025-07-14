import config from '../../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Preview.css';

const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

function Preview() {
  const [newsList, setNewsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    fetch(`${config.API_BASE_URL}/api/author/news/mine?userId=${userId}`)
      .then(res => res.json())
      .then(data => setNewsList(data))
      .catch(err => console.error("Error fetching author's news:", err));
  }, []);

  const handleClick = (id) => {
    navigate(`/author/news/${id}`); // atau `/detail/${slug}` jika kamu pakai slug
  };

  return (
    <div className="preview-container">
      {newsList.length > 0 ? (
        newsList.map((news) => (
          <div className="mini-news-card" key={news.id} onClick={() => handleClick(news.id)}>
            <img src={news.imageUrl} alt={news.title} />
            <div className="mini-news-content">
              <h4>{news.title}</h4>
              <p>{news.category}</p>
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#ccc' }}>Belum ada artikel yang kamu buat.</p>
      )}
    </div>
  );
}

export default Preview;
