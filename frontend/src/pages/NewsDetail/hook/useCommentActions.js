import config from '../../../config';

export const useCommentAction = (newsId, userId) => {
  const reactToComment = async (commentId, action, refetch) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/comments/${commentId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success && refetch) refetch();
    } catch (err) {
      console.error("Gagal memberikan reaksi komentar:", err);
    }
  };

  const submitReply = async (parentId, replyText, refetch) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/comments/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newsId,
          parentId,
          commentText: replyText,
        }),
      });
      const data = await res.json();
      if (data.success && refetch) refetch();
    } catch (err) {
      console.error("Gagal mengirim balasan:", err);
    }
  };

  return {
    reactToComment,
    submitReply,
  };
};
