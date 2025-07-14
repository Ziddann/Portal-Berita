import { useState } from "react";
import config from '../../../config';

export const useNewsAction = (newsId, userId) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchNewsStatus = async () => {
    try {
      const [likeRes, bookmarkRes, newsRes] = await Promise.all([
        fetch(`${config.API_BASE_URL}/api/news/${newsId}/liked/${userId}`).then(res => res.json()),
        fetch(`${config.API_BASE_URL}/api/news/${newsId}/bookmarked/${userId}`).then(res => res.json()),
        fetch(`${config.API_BASE_URL}/api/news/${newsId}`).then(res => res.json()),
      ]);
      setIsLiked(likeRes.liked);
      setIsBookmarked(bookmarkRes.bookmarked);
      setLikeCount(newsRes.likes || 0);
    } catch (err) {
      console.error("Gagal fetch status berita:", err);
    }
  };

  const toggleLike = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/news/${newsId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLiked(data.liked);
        setLikeCount(data.likes);
      }
    } catch (err) {
      console.error("Gagal toggle like:", err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/news/${newsId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (err) {
      console.error("Gagal toggle bookmark:", err);
    }
  };

  return {
    isLiked,
    likeCount,
    isBookmarked,
    fetchNewsStatus,
    toggleLike,
    toggleBookmark,
  };
};
