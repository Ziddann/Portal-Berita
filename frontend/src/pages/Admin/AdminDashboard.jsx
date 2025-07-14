import React from 'react';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import RecentReports from './RecentReports';
import NewsApproval from './NewsApproval';
import ContentManagement from './ContentManagement';
import './Styles/AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-dashboard-content">
        <DashboardOverview />
        <RecentReports limit={4} />

        <NewsApproval />
        <ContentManagement />
      </div>
    </div>
  );
}

export default AdminDashboard;
