import config from '../../config';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNotification } from '../../components/Notification';
import './Styles/UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/admin/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      showNotification("Gagal mengambil data user", 'error');
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user.id);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    try {
      const res = await axios.put(`${config.API_BASE_URL}/api/admin/users/${editingUserId}`, editForm);
      if (res.data.success) {
        fetchUsers();
        cancelEditing();
        showNotification("User berhasil diperbarui", 'success');
      } else {
        showNotification("Gagal memperbarui user", 'error');
      }
    } catch (err) {
      console.error("Gagal update user:", err);
      showNotification("Terjadi kesalahan saat memperbarui user", 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${config.API_BASE_URL}/api/admin/users/${id}`);
      if (res.data.success) {
        setUsers(users.filter(user => user.id !== id));
        showNotification("User berhasil dihapus", 'success');
      } else {
        showNotification("Gagal menghapus user", 'error');
      }
    } catch (err) {
      console.error("Gagal hapus user:", err);
      showNotification("Terjadi kesalahan saat menghapus user", 'error');
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Komentar</th>
            <th>Likes</th>
            <th>Views</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {editingUserId === user.id ? (
                  <input name="name" value={editForm.name} onChange={handleChange} />
                ) : user.name}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <input name="email" value={editForm.email} onChange={handleChange} />
                ) : user.email}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <select name="role" value={editForm.role} onChange={handleChange}>
                    <option value="admin">admin</option>
                    <option value="author">author</option>
                    <option value="reader">reader</option>
                  </select>
                ) : user.role}
              </td>
              <td>{user.commentCount || 0}</td>
              <td>{user.totalLikes || 0}</td>
              <td>{user.totalViews || 0}</td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button onClick={saveChanges}>Simpan</button>
                    <button onClick={cancelEditing}>Batal</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Hapus</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
