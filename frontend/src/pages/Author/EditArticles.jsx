import config from '../../config';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useNotification } from '../../components/Notification';
import './Styles/EditArticles.css';

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const role = localStorage.getItem('role');

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/api/author/news/${id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title,
          description: data.description,
          date: data.date,
          category: data.category,
          imageUrl: data.imageUrl,
        });
        setPreview(data.imageUrl);
      })
      .catch(err => {
        console.error('Failed to fetch news:', err);
        showNotification('Gagal memuat data berita.', 'error');
      });
  }, [id, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('date', form.date);
    formData.append('category', form.category);
    if (imageFile) {
      formData.append('image', imageFile); // Key ini harus sesuai dengan backend
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/author/news/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        showNotification('Berita berhasil diperbarui!', 'success');
        navigate(role === 'admin' ? '/admin/dashboard' : '/author/dashboard');
      } else {
        showNotification('Gagal memperbarui berita.', 'error');
      }
    } catch (err) {
      console.error('Error updating news:', err);
      showNotification('Terjadi kesalahan server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-news-container">
      <LoadingOverlay isLoading={isLoading} />
      <h2>Edit Berita</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Judul</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Deskripsi</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Tanggal</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Kategori</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Pilih Kategori</option>
          <option value="politik">Politik</option>
          <option value="olahraga">Olahraga</option>
          <option value="hiburan">Hiburan</option>
          <option value="teknologi">Teknologi</option>
        </select>

        <label>Gambar</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && <img src={preview.startsWith('http') ? preview : `${config.API_BASE_URL}${preview}`} alt="Preview" className="preview-img" />}

        <button type="submit">Update Berita</button>
      </form>
    </div>
  );
}

export default EditNews;
