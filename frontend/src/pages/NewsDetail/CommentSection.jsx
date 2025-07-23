import config from '../../config';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCommentAction } from "./hook/useCommentActions";
import "./Styles/CommentSection.css";
import ReportButton from "../../components/ReportButton";
import { useNotification } from "../../components/Notification";

function CommentSection({ newsId, userId }) {
  const [comments, setComments] = useState([]);
  const [repliesMap, setRepliesMap] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [commentText, setCommentText] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [role, setRole] = useState("");

  const { showNotification } = useNotification();
  const { reactToComment, submitReply } = useCommentAction(newsId, userId);

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/comments/${newsId}`);
      const data = res.data;
      const main = data.filter(c => c.parentId === null);
      const map = {};
      data.forEach(c => {
        if (c.parentId !== null) {
          if (!map[c.parentId]) map[c.parentId] = [];
          map[c.parentId].push(c);
        }
      });
      setComments(main);
      setRepliesMap(map);
    } catch (err) {
      console.error("Gagal mengambil komentar:", err);
      showNotification("Gagal mengambil komentar", "error");
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(`${config.API_BASE_URL}/api/comments`, {
        userId,
        newsId,
        commentText
      });
      setCommentText("");
      showNotification("Komentar berhasil dikirim", "success");
      fetchComments();
    } catch (err) {
      console.error("Gagal mengirim komentar:", err);
      showNotification("Gagal mengirim komentar", "error");
    }
  };

  const handleReplyToggle = (commentId) => {
    setReplyInputs(prev => ({
      ...prev,
      [commentId]: prev[commentId] === undefined ? "" : undefined
    }));
  };

  const handleReplyInputChange = (e, commentId) => {
    setReplyInputs(prev => ({ ...prev, [commentId]: e.target.value }));
  };

  const handleReplySubmit = async (parentId) => {
    const replyText = replyInputs[parentId];
    if (!replyText?.trim()) return;
    try {
      await submitReply(parentId, replyText);
      setReplyInputs(prev => ({ ...prev, [parentId]: undefined }));
      showNotification("Balasan berhasil dikirim", "success");
      fetchComments();
    } catch (err) {
      console.error("Gagal membalas komentar:", err);
      showNotification("Gagal mengirim balasan", "error");
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  // ✅ Jangan tampilkan kalau role admin/author
  if (role === "admin" || role === "author") {
    return null;
  }

  return (
    <div className="comment-section">
      <h3>Komentar</h3>

      <div className="comment-input">
        <textarea
          placeholder="Tulis komentar..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleCommentSubmit}>Kirim</button>
      </div>

      <div className="comments-list">
        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <img src={comment.profileImage} alt={comment.username} />
              <div>
                <strong>{comment.username}</strong>
                <p>{comment.commentText}</p>
              </div>
            </div>
            <div className="comment-reactions">
              <button onClick={() => reactToComment(comment.id, "like", fetchComments)}>👍 {comment.likes || 0}</button>
              <button onClick={() => reactToComment(comment.id, "dislike", fetchComments)}>👎 {comment.dislikes || 0}</button>
              <button onClick={() => handleReplyToggle(comment.id)}>💬 Balas</button>
              <ReportButton userId={userId} targetType="comment" targetId={comment.id} />
            </div>

            {replyInputs[comment.id] !== undefined && (
              <div className="reply-input">
                <input
                  type="text"
                  placeholder="Tulis balasan..."
                  value={replyInputs[comment.id] || ""}
                  onChange={(e) => handleReplyInputChange(e, comment.id)}
                />
                <button onClick={() => handleReplySubmit(comment.id)}>Kirim</button>
              </div>
            )}

            {repliesMap[comment.id] && !showReplies[comment.id] && (
              <div className="toggle-replies">
                <button onClick={() => toggleReplies(comment.id)}>
                  Lihat {repliesMap[comment.id].length} balasan
                </button>
              </div>
            )}

            {showReplies[comment.id] && (
              <div className="reply-box">
                {repliesMap[comment.id]?.map(reply => (
                  <div key={reply.id} className="comment-item reply">
                    <div className="comment-header">
                      <img src={reply.profileImage} alt={reply.username} />
                      <div>
                        <strong>{reply.username}</strong>
                        <p>
                          <span className="reply-arrow">↪ <strong>{comment.username}</strong> </span>
                          {reply.commentText}
                        </p>
                      </div>
                    </div>
                    <div className="comment-reactions">
                      <button onClick={() => reactToComment(reply.id, "like", fetchComments)}>👍 {reply.likes || 0}</button>
                      <button onClick={() => reactToComment(reply.id, "dislike", fetchComments)}>👎 {reply.dislikes || 0}</button>
                      <button onClick={() => handleReplyToggle(reply.id)}>💬 Balas</button>
                      <ReportButton userId={userId} targetType="comment" targetId={reply.id} />
                    </div>
                    {replyInputs[reply.id] !== undefined && (
                      <div className="reply-input">
                        <input
                          type="text"
                          placeholder="Tulis balasan..."
                          value={replyInputs[reply.id] || ""}
                          onChange={(e) => handleReplyInputChange(e, reply.id)}
                        />
                        <button onClick={() => handleReplySubmit(reply.id)}>Kirim</button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="toggle-replies">
                  <button onClick={() => toggleReplies(comment.id)}>Sembunyikan balasan</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
