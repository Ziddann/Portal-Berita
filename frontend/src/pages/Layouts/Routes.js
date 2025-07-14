import AdminLayout from './pages/Admin/AdminLayout';
import AuthorLayout from './pages/Author/AuthorLayout';

<Routes>
  {/* Halaman publik */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Admin */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="articles" element={<ContentManagement />} />
    <Route path="reports" element={<RecentReports />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="create-news" element={<CreateNews />} />
    <Route path="profile" element={<Profile />} />
  </Route>

  {/* Author */}
  <Route path="/author" element={<AuthorLayout />}>
    <Route path="dashboard" element={<AuthorDashboard />} />
    <Route path="create-news" element={<CreateNews />} />
    <Route path="profile" element={<Profile />} />
    <Route path="news/:id" element={<NewsDetail />} />
    <Route path="edit-news/:id" element={<EditNews />} />
  </Route>
</Routes>
