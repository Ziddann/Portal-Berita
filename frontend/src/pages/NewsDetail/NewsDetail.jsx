import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import NewsSection from "./NewsSection";
import CommentSection from "./CommentSection";

import "./styles/NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const newsId = id;
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const [comments, setComments] = useState([]);

  // Jangan tampilkan navbar & footer jika path mengandung "/admin" atau "/author"
  const hideLayout = location.pathname.startsWith("/admin") || location.pathname.startsWith("/author");

  return (
    <div className="page-container">
      {!hideLayout && <Navbar />}

      <div className="news-detail-wrapper">
        <NewsSection newsId={newsId} />
        <CommentSection newsId={newsId} userId={userId} />
      </div>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default NewsDetail;
