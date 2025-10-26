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

## 📄 Lisensi
Proyek ini bersifat open-source dan dapat dikembangkan kembali untuk keperluan pembelajaran.

---

💡 **Dibuat oleh:** Muhammad Dio Imananda Putera  
📅 **Tahun:** 2025  
🌐 **Teknologi:** HTML • TailwindCSS • JavaScript (LocalStorage)
