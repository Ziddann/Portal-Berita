import config from '../../config';
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Styles/NewsSection.css";
import ReportButton from "../../components/ReportButton";
import { estimateReadTime } from "./hook/utils";
import { useNewsAction } from "./hook/useNewsActions";

const NewsSection = ({ newsId }) => {
  const [news, setNews] = useState(null);
  const [role, setRole] = useState("");

  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const {
    isLiked,
    likeCount,
    isBookmarked,
    fetchNewsStatus,
    toggleLike,
    toggleBookmark,
  } = useNewsAction(newsId, userId);

  useEffect(() => {
    const storedRole = sessionStorage.getItem("role") || localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const fetchNews = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/news/${newsId}`);
        setNews(res.data);
      } catch (err) {
        console.error("Gagal mengambil detail berita:", err);
      }
    };

    fetchNews();
    if (newsId && userId) fetchNewsStatus();
  }, [newsId, userId, fetchNewsStatus]);

  useEffect(() => {
    const recordView = async () => {
      if (!newsId || !userId) return;

      try {
        await axios.post(`${config.API_BASE_URL}/api/news/${newsId}/view`, { userId });
      } catch (err) {
        console.error("Gagal merekam view:", err);
      }
    };

    recordView();
  }, [newsId, userId]);

  if (!news) return <p>Memuat detail berita...</p>;

  const readTime = estimateReadTime(news.description || "");

  return (
    <div className="news-detail-section">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <a href="/">Beranda</a> &gt;{" "}
        <a href={`/kategori/${news.category}`}>{news.category?.toUpperCase() || "UMUM"}</a> &gt;{" "}
        <span>{news.title}</span>
      </div>

      {/* Meta Info */}
      <div className="meta-top">
        <span className="category-badge">{news.category?.toUpperCase() || "UMUM"}</span>
        <span className="dot">•</span>
        <span>
          {news.time
            ? new Date(news.time).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "-"}
        </span>
        <span className="dot">•</span>
        <span>{readTime} menit baca</span>
        <span className="dot">•</span>
        <span>{likeCount} suka</span>
      </div>

      {/* Judul */}
      <h1 className="news-title">{news.title}</h1>

      {/* Penulis */}
      <div className="author-section">
        <div>
          <p className="author-name">{news.author || "Redaksi Politik"}</p>
          <p className="author-role">Senior Political Reporter</p>
        </div>
      </div>

      {/* Gambar utama */}
      <div className="news-image">
        {news.imageUrl ? (
          <img src={news.imageUrl} alt="News" />
        ) : (
          <p>Gambar Utama - Presiden dalam Konferensi Pers</p>
        )}
      </div>

      {/* Isi berita */}
      <div className="news-content">
        <p className="intro">{news.description || "Konten belum tersedia."}</p>
      </div>

      {/* Tombol Aksi - hanya jika bukan admin/author */}
      {role !== "admin" && role !== "author" && (
        <div className="action-buttons">
          <button onClick={toggleLike}>
            {isLiked ? "💖 Disukai" : "👍 Suka"}
          </button>
          <button onClick={toggleBookmark}>
            {isBookmarked ? "🔖 Disimpan" : "🔖 Simpan"}
          </button>
          <ReportButton userId={userId} targetType="news" targetId={newsId} />
        </div>
      )}

      <hr className="divider" />
    </div>
  );
};

export default NewsSection;
