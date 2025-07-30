# 📰 Briefly Portal

**Briefly Portal** adalah aplikasi web fullstack yang berfungsi sebagai sistem portal berita modern. Proyek ini dikembangkan sebagai bagian dari program magang di **PT. Winnicode Garuda Teknologi**, dengan fokus pada manajemen konten berita, otorisasi pengguna, dan tampilan responsif yang profesional.

---

## 🚀 Fitur Unggulan

- 🔐 Login & Registrasi (JWT Auth)
- 👥 Manajemen Role: Admin, Editor, User
- 🗞️ CRUD Berita, Kategori & Tag
- 🔍 Pencarian & Filter berita berdasarkan kata kunci
- 📊 Dashboard Admin: Statistik & data pengguna
- 💬 Komentar pengguna
- 📌 Bookmark berita favorit
- 🔔 Notifikasi berita baru (Live via Pusher)
- 🌐 Dukungan Multibahasa
- 📱 Tampilan Responsif (Tailwind CSS)

---

## 🧰 Teknologi yang Digunakan

### Backend
- **Node.js**, **Express.js**
- **MySQL** + `mysql2`
- **JWT** (Authentication)
- **Multer** (Upload gambar)
- **bcryptjs**, **dotenv**, **cors**

### Frontend (planned)
- **React.js**
- **Tailwind CSS**
- **React Router DOM**
- **Axios**

---

## 📁 Struktur Proyek 

briefly-portal/
├── backend/
│ ├── server.js
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middlewares/
│ └── uploads/
├── frontend/ (dalam pengembangan)
│ ├── src/
│ └── ...
└── README.md

yaml
Copy
Edit

---

## ⚙️ Menjalankan Proyek (Backend)

1. Clone repo ini:
   ```bash
   git clone https://github.com/Ziddann/Portal-Berita.git
   cd briefly-portal/backend
Install dependensi:

bash
Copy
Edit
npm install
Buat file .env dan isi seperti ini:

ini
Copy
Edit
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=portal_berita
JWT_SECRET=secret123
Jalankan server:

bash
Copy
Edit
npm run dev
🌐 Deployment
Platform	Deskripsi
Railway	✅ Backend deployed
Vercel	🔜 Frontend (on progress)

👨‍💻 Developer
Proyek ini dikembangkan oleh:

Ziddan Fadillah
Fullstack Web Developer Intern
📅 Maret – Juli 2025
🏢 PT. Winnicode Garuda Teknologi
🔗 github.com/Ziddann

📄 Lisensi
MIT License © 2025 Ziddan Fadillah

📌 Catatan Tambahan
Briefly Portal masih dalam tahap pengembangan frontend. Fitur backend telah mencakup otorisasi pengguna, pengelolaan berita, serta sistem komentar dan bookmark. Frontend akan dibangun menggunakan React dan Tailwind agar responsif dan user-friendly.
