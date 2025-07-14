import config from '../config';
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "./Bookmark.css";

function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return alert("Silakan login untuk melihat bookmark.");

    fetch(`${config.API_BASE_URL}/api/bookmarks/${userId}`)
      .then(res => res.json())
      .then(data => setBookmarks(data))
      .catch(err => console.error("Gagal ambil bookmark:", err));
  }, [userId]);

  return (
    <>
      <Navbar />

      <div className="bookmark-hero">
        <h2 className="bookmark-title">Berita Tersimpan</h2>
        <p className="bookmark-subtitle">Koleksi artikel pilihan Anda dapat diakses kapan saja</p>
      </div>

      <div className="bookmark-container">
        <div className="bookmark-filters">
          <div>
            <button className="filter active">Semua</button>
            <button className="filter">Politik</button>
            <button className="filter">Ekonomi</button>
            <button className="filter">Teknologi</button>
            <button className="filter">Olahraga</button>
          </div>
          <select className="sort-select">
            <option>Terbaru disimpan</option>
            <option>Terlama disimpan</option>
          </select>
        </div>

        <div className="bookmark-list">
          {bookmarks.length > 0 ? (
            bookmarks.map((news) => (
              <div key={news.id} className="bookmark-card">
                <div className="bookmark-image">
                  <img src={news.imageUrl} alt={news.title} />
                </div>
                <div className="bookmark-info">
                  <span className="bookmark-category">{news.category || "Kategori"}</span>
                  <h3 className="bookmark-news-title">{news.title}</h3>
                  <span className="bookmark-date">
                    {new Date(news.date).toLocaleDateString("id-ID")}
                  </span>
                  <p className="bookmark-description">{news.description}</p>
                  <p className="bookmark-meta">Oleh {news.author || "Admin"}</p>
                  <Link to={`/news/${news.id}`} className="read-more">Baca Artikel</Link>
                </div>
              </div>
            ))
          ) : (
            <p>Belum ada berita tersimpan.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookmarkPage;
