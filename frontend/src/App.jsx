// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail/NewsDetail';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Bookmark from './pages/Bookmark';
import Profile from './pages/Auth/Profile';
import CreateNews from './pages/Author/CreateNews';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ContentManagement from './pages/Admin/ContentManagement';
import SearchResult from './pages/SearchResult';
import AuthorDashboard from './pages/Author/AuthorDashboard';
import EditNews from './pages/Author/EditArticles';
import RecentReports from './pages/Admin/RecentReports';
import UserManagement from './pages/Admin/UserManagement';
import BackToDashboardButton from './pages/Admin/component/BackToDashboard';
import CommentManagement from './pages/Admin/CommentManagement';

import { NotificationProvider } from './components/Notification'; // ✅ import provider
import './components/Styles/Notification.css'; // ✅ pastikan CSS-nya juga diimport

function App() {
  return (
    <NotificationProvider> {/* ✅ Bungkus semua halaman */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/author/dashboard" element={<AuthorDashboard />} />
        <Route path="/author/news/:id" element={<NewsDetail />} />
        <Route path="/author/create-news" element={<CreateNews /> } />   
        <Route path="/author/profile" element={<Profile />} />     
        <Route path="/author/edit-news/:id" element={<EditNews />} />
        <Route path="/author/news/:id" element={<NewsDetail />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />        
        <Route path="/admin/articles" element={<ContentManagement />} />        
        <Route path="/admin/reports" element={<RecentReports />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/create-news" element={<CreateNews />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/comments" element={<CommentManagement />} />
        <Route path="/admin/news/:id" element={<NewsDetail />} />
      </Routes>

      <BackToDashboardButton />
    </NotificationProvider>
  );
}

export default App;
console.log("App Rendered");
