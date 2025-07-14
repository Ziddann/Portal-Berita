import React from "react";
import "./Styles/LoadingOverlay.css";

function LoadingOverlay({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  );
}

export default LoadingOverlay;
