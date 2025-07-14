import config from '../../config';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification';
import { useNavigate } from 'react-router-dom';
import './Styles/NewsApprovalCards.css';

function NewsApproval() {
  const [pendingNews, setPendingNews] = useState([]);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingNews();
  }, []);

  const fetchPendingNews = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/all`);
      const data = await res.json();
      const filtered = data.filter(item => item.status.toLowerCase() === 'pending');
      setPendingNews(filtered);
    } catch (err) {
      console.error('Gagal fetch berita pending:', err);
      showNotification('Gagal mengambil daftar berita pending.', 'error');
    }
  };

  const handleApproval = async (id, status) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (data.success) {
        showNotification(
          `Berita berhasil ${status === 'Published' ? 'disetujui' : 'ditolak'}.`,
          status === 'Published' ? 'success' : 'info'
        );
        fetchPendingNews();
      } else {
        showNotification('Gagal memperbarui status berita.', 'error');
      }
    } catch (err) {
      console.error('Gagal update status:', err);
      showNotification('Terjadi kesalahan saat memperbarui status berita.', 'error');
    }
  };

  return (
    <div className="approval-page">
      <div className="approval-header-container">
        <h1 className="approval-header">Permintaan Persetujuan Berita</h1>
      </div>

      <div className="approval-card-container">
        {pendingNews.length === 0 ? (
          <p className="no-news">Tidak ada berita yang menunggu persetujuan.</p>
        ) : (
          pendingNews.map(news => (
            <div
              key={news.id}
              className="news-card"
              onClick={() => navigate(`/admin/news/${news.id}`)}
            >
              {news.imageUrl && (
                <img src={news.imageUrl} alt="thumbnail" className="news-thumb" />
              )}
              <div className="news-info">
                <h4>{news.title}</h4>
                <p className="category">{news.category || 'Umum'}</p>
                <p className="author">Oleh: {news.authorName || '-'}</p>
              </div>
              <div className="card-actions" onClick={e => e.stopPropagation()}>
                <button
                  className="approve-btn"
                  onClick={() => handleApproval(news.id, 'Published')}
                >
                  Approve
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleApproval(news.id, 'Rejected')}
                >
                  Tolak
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NewsApproval;
