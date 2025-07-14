import React from 'react';
import './Styles/AuthorDashboard.css';
import AuthorSidebar from './AuthorSidebar';
import MyArticles from './MyArticles';
import Preview from './Preview';

function AuthorDashboard() {
  return (
    <div className="author-dashboard">
      <AuthorSidebar />
      <div className="author-main-content">



        <div className="my-articles-section">
          <h2 style={{ margin: '40px 0 20px' }}>Semua Artikel</h2>
          <MyArticles />
        </div>
        <div className="preview-section">
          <h2 style={{ marginBottom: '10px' }}>Preview Artikel Saya</h2>
          <Preview />
        </div>
      </div>
    </div>
  );
}

export default AuthorDashboard;
