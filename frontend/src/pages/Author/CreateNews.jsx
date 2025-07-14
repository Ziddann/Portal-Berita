import config from '../../config';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification';
import './Styles/CreateNews.css';

const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
const role = localStorage.getItem("role") || sessionStorage.getItem("role");

function CreateNews() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          imageUrl: form.imageUrl,
          date: form.date,
          category: form.category,
          authorId: userId,
        }),
      });

      const data = await response.json();

      if (data.message) {
        showNotification('Berita berhasil dibuat!', 'success');

        // Reset form
        setForm({
          title: '',
          description: '',
          imageUrl: '',
          date: '',
          category: '',
        });

        // Redirect sesuai role
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin/dashboard');
          } else if (role === 'author') {
            navigate('/author/dashboard');
          }
        }, 1500);
      } else {
        showNotification('Gagal membuat berita.', 'error');
      }
    } catch (error) {
      console.error('Error creating news:', error);
      showNotification('Terjadi kesalahan saat membuat berita.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />

      <div className="create-news-container">
        <h2 className="create-news-title">Create News</h2>
        <form className="create-news-form" onSubmit={handleSubmit}>
          <label>Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required />

          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />

          <label>Image URL</label>
          <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} required />

          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="teknologi">Teknologi</option>
            <option value="politik">Politik</option>
            <option value="olahraga">Olahraga</option>
            <option value="hiburan">Hiburan</option>
          </select>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Mengirim...' : 'Submit News'}
          </button>
        </form>
      </div>
    </>
  );
}

export default CreateNews;
