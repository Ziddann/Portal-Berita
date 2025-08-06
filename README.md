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
- 📱 Tampilan Responsif

---

## 🧰 Teknologi yang Digunakan

### Backend
- **Node.js**, **Express.js**
- **MySQL** + `mysql2`
- **JWT** (Authentication)
- **Multer** (Upload gambar)
- **bcryptjs**, **dotenv**, **cors**

### 🎨 Frontend
- **React.js**
- **React Router DOM**
- **Axios**

---

## 📁 Struktur Proyek 

briefly-portal/
├── backend/
│ ├── server.js
│ ├── routes/
│ └── uploads/
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── main.jsx
│ └── .env
└── README.md

---

## ⚙️ Menjalankan Proyek (Backend)

1. Clone repo ini:
   ```
   git clone https://github.com/Ziddann/Portal-Berita.git
   cd briefly-portal/backend
   ```
   
2. Install dependensi:
```
npm install
```

3. Buat file .env dan isi seperti ini:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=portal_berita
```

4. Jalankan server:
```
nodemon server.js / node server.js
```

---

## ⚙️ Menjalankan Proyek (Frontend)

1. Pindah ke direktori frontend:

   ```
   cd briefly-portal/frontend
   ```

2. Install dependensi:

   ```
   npm install
   ```

3. Buat file `.env` dan isi seperti ini:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. Jalankan aplikasi:

   ```
   npm run dev
   ```

5. Akses frontend di browser:

   ```
   http://localhost:5173
   ```

---


🌐 Deployment
Platform	Deskripsi
Railway	✅ Backend deployed
Vercel	✅ Frontend deployed

👨‍💻 Developer
Proyek ini dikembangkan oleh:

Ziddan Fadillah
Fullstack Web Developer Intern
📅 Maret – Juli 2025
🏢 PT. Winnicode Garuda Teknologi
🔗 github.com/Ziddann

