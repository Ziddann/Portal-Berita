import config from '../../config';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "../../components/Notification";
import "./Styles/RecentReport.css";

function RecentReports({ limit = null }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/admin/reports`);
      const data = res.data;
      setReports(limit ? data.slice(0, limit) : data);
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);
      showNotification("Gagal mengambil laporan dari server.", "error");
    }
  };

  const handleOpenModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleDeleteContent = async () => {
    try {
      await axios.delete(
        `${config.API_BASE_URL}:5000/api/admin/${selectedReport.targetType}/${selectedReport.targetId}`
      );
      showNotification("Konten berhasil dihapus!", "success");
      handleCloseModal();
      fetchReports();
    } catch (err) {
      console.error("Gagal menghapus konten:", err);
      showNotification("Terjadi kesalahan saat menghapus konten.", "error");
    }
  };

  const handleIgnoreReport = async () => {
    try {
      await axios.delete(
        `${config.API_BASE_URL}/api/admin/reports/${selectedReport.id}`
      );
      showNotification("Laporan berhasil diabaikan.", "info");
      handleCloseModal();
      fetchReports();
    } catch (err) {
      console.error("Gagal menghapus laporan:", err);
      showNotification("Terjadi kesalahan saat mengabaikan laporan.", "error");
    }
  };

  return (
    <div className="recent-reports-section">
      <h3>Laporan Terbaru</h3>

      <div className="report-overview-grid">
        {reports.map((report) => (
          <div key={report.id} className="report-box" onClick={() => handleOpenModal(report)}>
            <strong>{report.targetType} #{report.targetId}</strong>
            <p><strong>Pelapor:</strong> {report.reporterName}</p>
            <p><strong>Alasan:</strong> {report.reason}</p>
            <p><strong>Catatan:</strong> {report.note || "-"}</p>
            <p style={{ color: "#aaa", fontSize: "12px", marginTop: "8px" }}>
              {new Date(report.created_at).toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>

      {showModal && selectedReport && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Tindak Laporan</h4>
            <p><strong>Target:</strong> {selectedReport.targetType} #{selectedReport.targetId}</p>
            <p><strong>Konten yang Dilaporkan:</strong><br />
              <em>{selectedReport.reportedContent}</em>
            </p>
            <p><strong>Alasan:</strong> {selectedReport.reason}</p>
            <p><strong>Pelapor:</strong> {selectedReport.reporterName} ({selectedReport.reporterEmail})</p>

            <div className="modal-actions">
              <button onClick={handleIgnoreReport}>Abaikan</button>
              <button onClick={handleDeleteContent}>Hapus Konten</button>
              <button onClick={handleCloseModal}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentReports;
