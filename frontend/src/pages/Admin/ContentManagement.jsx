import config from '../../config';
import React, { useEffect, useState } from 'react';
import './Styles/ContentManagement.css';
import { useNotification } from '../../components/notification';
import LoadingOverlay from '../../components/LoadingOverlay';

function ContentManagement() {
  const [newsList, setNewsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();

  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    authorName: '',
    description: '',
    imageUrl: '',
    category: '',
    status: 'Draft',
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/all`);
      const data = await res.json();
      setNewsList(data);
    } catch (err) {
      console.error("Error fetching news:", err);
      showNotification("Gagal mengambil data berita", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (news) => {
    setEditForm({
      id: news.id,
      title: news.title || '',
      authorName: news.authorName || '',
      description: news.description || '',
      imageUrl: news.imageUrl || '',
      category: news.category || '',
      status: news.status || 'Draft',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/${editForm.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        fetchNews();
        closeModal();
        showNotification("Berita berhasil diupdate", "success");
      } else {
        showNotification("Gagal update berita", "error");
      }
    } catch (err) {
      console.error("Error updating news:", err);
      showNotification("Terjadi kesalahan saat update", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/news/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
        showNotification("Berita berhasil dihapus", "success");
      } else {
        showNotification("Gagal menghapus berita", "error");
      }
    } catch (err) {
      console.error("Error deleting news:", err);
      showNotification("Terjadi kesalahan saat menghapus", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredNews = () => {
    if (showAll) return newsList;
    return newsList.filter((news) => {
      const status = (news.status || '').toLowerCase();
      return status === 'draft' || status === 'pending' || status === 'rejected';
    });
  };

  return (
    <div className="content-management">
      <LoadingOverlay isLoading={isLoading} />

      <h3>Content Management</h3>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Sembunyikan Published' : 'Tampilkan Semua'}
        </button>
      </div>

      <table className="content-table">
        <thead>
          <tr>
            <th>Judul</th>
            <th>Author</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredNews().length > 0 ? (
            getFilteredNews().map((news) => (
              <tr key={news.id}>
                <td>{news.title}</td>
                <td>{news.authorName || '-'}</td>
                <td>{news.category || '-'}</td>
                <td>{news.status}</td>
                <td>
                  {news.imageUrl ? (
                    <img src={news.imageUrl} alt="Thumbnail" width="50" />
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <button onClick={() => handleEditClick(news)}>Edit</button>
                  <button onClick={() => handleDelete(news.id)}>Hapus</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Tidak ada berita ditemukan.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Berita</h3>

            <label>Judul:</label>
            <input name="title" value={editForm.title} onChange={handleEditChange} />

            <label>Author:</label>
            <input name="authorName" value={editForm.authorName} onChange={handleEditChange} />

            <label>Deskripsi:</label>
            <textarea
              name="description"
              rows="4"
              value={editForm.description}
              onChange={handleEditChange}
            />

            <label>Image URL:</label>
            <input name="imageUrl" value={editForm.imageUrl} onChange={handleEditChange} />

            <label>Kategori:</label>
            <input name="category" value={editForm.category} onChange={handleEditChange} />

            <label>Status:</label>
            <select name="status" value={editForm.status} onChange={handleEditChange}>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <div className="modal-actions">
              <button onClick={handleEditSubmit}>Simpan</button>
              <button onClick={closeModal}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentManagement;
