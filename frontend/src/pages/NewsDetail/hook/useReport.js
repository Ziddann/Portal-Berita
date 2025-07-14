// useReport.js
import axios from "axios";
import config from '../../../config';

export function useReport(userId) {
  const report = async (targetType, targetId, reason, note) => {
    if (!reason.trim()) return;

    try {
      await axios.post(`${config.API_BASE_URL}/api/reports`, {
        reporterId: userId,
        targetType,
        targetId,
        reason,
        note,
      });
      // Jangan pakai di sini
    } catch (err) {
      console.error("Gagal mengirim laporan:", err);
      throw err; // biar bisa ditangani dari luar
    }
  };

  return { report };
}
