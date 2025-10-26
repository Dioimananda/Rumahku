# 🏠 Rumahku - Property Marketplace

Rumahku adalah aplikasi marketplace properti berbasis web sederhana yang dibuat menggunakan **HTML**, **Tailwind CSS**, dan **JavaScript (localStorage)**.  
Website ini memungkinkan pengguna untuk **mendaftar, login, mengelola properti, mengirim pesan**, serta **melakukan permintaan upgrade akun menjadi penjual**.

---

## 🚀 Fitur Utama

### 🔐 Autentikasi & Role
- Login & Register (customer default)
- Role-based system:
  - **Customer** → dapat melihat properti & mengirim pesan.
  - **Penjual/Seller** → dapat menambah, mengedit, dan menghapus properti.
  - **Admin** → dapat menyetujui permintaan upgrade akun penjual.

### 🏡 Properti
- Tambah, edit, dan hapus properti (khusus penjual).
- Filter properti berdasarkan lokasi, harga, dan tipe.
- Data disimpan secara lokal melalui **localStorage** dan file `properties.json`.

### 💬 Chat / Pesan
- Fitur chat sederhana antara pengguna dan admin.
- Menampilkan jumlah pesan belum dibaca.

### 📈 Admin Panel
- Admin dapat melihat dan menyetujui permintaan upgrade akun dari customer.

### 🎨 Tampilan Modern
- Menggunakan **Tailwind CSS** dengan efek **transisi lembut**.
- Terdapat navigasi antar halaman: Home, About, Services, Contact, dan Login/Register.

---

## 🧩 Struktur Folder

```
property-marketplace/
├── index.html
├── script.js
├── properties.json
├── Logo Astafera.png
└── README.md
```

---

## ⚙️ Cara Menjalankan

### 1. Jalankan secara lokal
Cukup buka file `index.html` di browser.
Namun agar `fetch('properties.json')` berfungsi dengan baik, disarankan menjalankan **server lokal**:

```bash
npx http-server .
# atau
npx live-server
```

Lalu buka `http://localhost:8080` atau port yang ditampilkan.

### 2. Jalankan di GitHub Pages
1. Push semua file ke repository GitHub (misal: `property-marketplace`).
2. Buka tab **Settings → Pages**.
3. Pada "Source", pilih `Branch: main` dan folder `/ (root)`.
4. Klik **Save**.
5. Tunggu 1-2 menit, lalu akses di:
   ```
   https://USERNAME.github.io/property-marketplace/
   ```

---

## 👨‍💻 Akun Default untuk Uji Coba

| Role | Username | Password |
|------|-----------|-----------|
| Admin | Dio | 123 |
| Customer | budi | 456 |
| Penjual | sari | 789 |

---

## 📄 Lisensi
Proyek ini bersifat open-source dan dapat dikembangkan kembali untuk keperluan pembelajaran.

---

💡 **Dibuat oleh:** Muhammad Dio Imananda Putera  
📅 **Tahun:** 2025  
🌐 **Teknologi:** HTML • TailwindCSS • JavaScript (LocalStorage)
