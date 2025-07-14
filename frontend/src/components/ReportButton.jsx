import React, { useState } from "react";
import { useReport } from "../pages/NewsDetail/hook/useReport";
import ModalPortal from "./ModalPortal";
import LoadingOverlay from "./LoadingOverlay";
import { useNotification } from "./notification";
import "./Styles/ReportButton.css";

function ReportButton({ userId, targetType, targetId }) {
  const { report } = useReport(userId);
  const { showNotification } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [description, setDescription] = useState("");

  const reasonsList = [
    "Konten menyesatkan",
    "Mengandung ujaran kebencian",
    "Informasi palsu",
    "Spam",
    "Pelanggaran hak cipta",
  ];

  const toggleReason = (reason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0 && !description.trim()) {
      showNotification("Pilih alasan atau isi catatan sebelum kirim.", "warning");
      return;
    }

    const reason = selectedReasons.join(", ");
    const note = description.trim();

    setIsLoading(true);
    try {
      await report(targetType, targetId, reason, note);
      showNotification("Laporan berhasil dikirim", "success");
      setIsOpen(false);
      setSelectedReasons([]);
      setDescription("");
    } catch (err) {
      console.error("Gagal kirim laporan:", err);
      showNotification("Gagal mengirim laporan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="report-modal-trigger">
        🚩 Laporkan
      </button>

      {isOpen && (
        <ModalPortal>
          <div className="report-modal-overlay">
            <LoadingOverlay isLoading={isLoading} />
            <div className="report-modal">
              <h3>Laporkan Konten</h3>
              <p>Pilih alasan pelaporan:</p>

              <div className="checkbox-group">
                {reasonsList.map((reason) => (
                  <label key={reason}>
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(reason)}
                      onChange={() => toggleReason(reason)}
                    />
                    {reason}
                  </label>
                ))}
              </div>

              <textarea
                placeholder="Catatan tambahan (opsional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <div className="modal-actions">
                <button onClick={() => setIsOpen(false)} className="cancel-btn">
                  Batal
                </button>
                <button onClick={handleSubmit} className="submit-btn">
                  Kirim Laporan
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}

export default ReportButton;
