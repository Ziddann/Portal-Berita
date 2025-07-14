import config from '../../config';
import React, { useEffect, useState } from 'react';
import { useNotification } from '../../components/Notification'; // ← pastikan path benar
import './Styles/MyArticles.css';

function MyArticles() {
  const [articles, setArticles] = useState([]);
  const userId = localStorage.getItem("userId");
  const { showNotification } = useNotification(); // ← pakai global notification

  useEffect(() => {
    fetchArticles();
  }, [userId]);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/author/news/mine?userId=${userId}`);
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
      showNotification("Gagal memuat artikel.", "error");
    }
  };

  const handleSubmitToAdmin = async (id) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/author/news/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pending' }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Berita diajukan ke admin!', 'success');
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal mengajukan ke admin.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Yakin ingin menghapus berita ini?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/author/news/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Berita berhasil dihapus.', 'success');
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
      showNotification('Gagal menghapus berita.', 'error');
    }
  };

  return (
    <div className="my-articles">
      <h2>My Articles</h2>
      {articles.length === 0 ? (
        <p>Belum ada artikel.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.date}</td>
                <td>{item.status}</td>
                <td>
                  {(item.status.toLowerCase() === 'draft' || item.status.toLowerCase() === 'rejected') && (
                    <>
                      <button onClick={() => window.location.href = `/author/edit-news/${item.id}`}>Edit</button>
                      <button onClick={() => handleDelete(item.id)}>Hapus</button>
                      <button onClick={() => handleSubmitToAdmin(item.id)}>Ajukan ke Admin</button>
                    </>
                  )}
                  {item.status.toLowerCase() === 'pending' && (
                    <em>Menunggu persetujuan admin...</em>
                  )}
                  {item.status.toLowerCase() === 'published' && (
                    <em>Sudah dipublikasikan</em>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyArticles;
