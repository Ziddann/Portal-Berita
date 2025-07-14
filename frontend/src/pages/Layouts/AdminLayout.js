import { Outlet } from 'react-router-dom';
import AdminSidebar from './component/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
}
