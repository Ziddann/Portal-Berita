import config from '../../config';
import React, { useEffect } from "react";

function ActionButtons({ newsId, userId, setIsLiked, setIsBookmarked, setLikeCount }) {


  useEffect(() => {
    if (!newsId || !userId) return;

    const fetchInitialStatus = async () => {
      try {
        const [likeRes, bookmarkRes, newsRes] = await Promise.all([
          fetch(`${config.API_BASE_URL}/news/${newsId}/liked/${userId}`).then(res => res.json()),
          fetch(`${config.API_BASE_URL}/news/${newsId}/bookmarked/${userId}`).then(res => res.json()),
          fetch(`${config.API_BASE_URL}/news/${newsId}`).then(res => res.json()),
        ]);

        setIsLiked(likeRes.liked);
        setIsBookmarked(bookmarkRes.bookmarked);
        setLikeCount(newsRes.likes || 0);
      } catch (err) {
        console.error("Gagal fetch awal:", err);
      }
    };

    fetchInitialStatus();
  }, [newsId, userId]);

  return null; // karena cuma buat fetch, gak render apapun
}

export default ActionButtons;
