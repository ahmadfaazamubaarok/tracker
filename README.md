<p align="center">
  <img src="public/assets/logo.svg" width="96" alt="Project Tracker Logo">
</p>

<h1 align="center">Project Tracker</h1>

<p align="center">
  <strong>Kanban board pribadi lintas platform (Desktop & Mobile) yang ringan, elegan, dan mandiri.</strong><br>
  Tanpa login, tanpa ketergantungan server/Docker — 100% berjalan independen & offline di perangkat Anda.<br>
  <code>Linux · Windows · macOS · Android · iOS · PWA</code>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Desktop%20%7C%20Mobile-blue?style=flat-square" alt="Platforms">
  <img src="https://img.shields.io/badge/Tech-React%2018%20%7C%20TypeScript%20%7C%20Tailwind-black?style=flat-square" alt="Tech">
  <img src="https://img.shields.io/badge/Packaging-Electron%20%7C%20Capacitor-emerald?style=flat-square" alt="Packaging">
  <img src="https://img.shields.io/badge/License-MIT-gray?style=flat-square" alt="License">
</p>

---

## ✨ Fitur Utama

- **Board Kanban 3 Kolom Interaktif (`Pending → WIP → Selesai`)**
  - Drag & drop kartu progres dengan animasi halus di desktop (mouse) maupun layar sentuh HP (touch).
  - Posisi dan urutan kartu otomatis tersimpan secara permanen.
- **Hierarki Data & Guard Berjenjang**
  - `Grup → Proyek → Progres → Sub Tugas / Checklist`.
  - Guard logic: tidak bisa membuat proyek tanpa grup, tidak bisa membuat progres tanpa proyek, dan proteksi hapus data berelasi.
- **Manajemen Proyek Lengkap**
  - Alamat domain (dengan tautan langsung), path direktori lokal, dan palet warna identitas proyek.
- **Kartu Progres & Sub Tugas (Checklist)**
  - Tenggat waktu (deadline) dengan indikator visual.
  - **Badge Terlambat**: deadline yang terlewat ditandai merah mencolok.
  - Prioritas berjenjang: *Rendah*, *Sedang*, dan *Tinggi*.
  - Sub tugas / checklist mini kanban (`pending`, `wip`, `done`).
  - Catatan teknis (notes editor) hingga 2000 karakter.
- **Sistem Arsip**
  - Kartu di kolom *Selesai* dapat diarsipkan agar board tetap rapi.
  - Halaman Arsip menyediakan opsi *Pulihkan* (kembali ke board) atau *Hapus Permanen*.
- **Penyaringan & Filter Cepat**
  - Filter board berdasarkan Grup atau Proyek tertentu.
- **Backup & Sinkronisasi Mandiri (Export & Import JSON)**
  - Ekspor seluruh database lokal ke file JSON kapan saja.
  - Impor file JSON untuk memindahkan data dari Laptop ke HP (atau sebaliknya).
- **Desain Minimalis Monokrom (Mobbin-style)**
  - Bersih, hairline border, stadium-pill button, dan tipografi Inter modern.
- **Zero Configuration & Offline-First**
  - Tidak memerlukan Docker, PHP, MySQL, atau konfigurasi port. Cukup pasang dan gunakan.

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Pengguna Akhir (Download Langsung dari GitHub Releases)

Unduh installer sesuai sistem operasi Anda di tab **[Releases](https://github.com/)**:
* **Windows:** Unduh file `Project-Tracker-Setup.exe` atau versi `portable.exe`.
* **Linux:** Unduh `Project-Tracker.AppImage` (jadikan executable: `chmod +x *.AppImage` lalu klik dua kali) atau file `.deb`.
* **macOS:** Unduh file `Project-Tracker.dmg` lalu seret ke folder Applications.
* **Android:** Unduh file `app-debug.apk` dan instal langsung di smartphone Anda.

---

### 2. Menjalankan untuk Pengembang (Development)

Pastikan telah menginstal [Node.js](https://nodejs.org/) (versi 18+).

```bash
# 1. Clone repositori
git clone https://github.com/username/tracker.git
cd tracker

# 2. Instal dependensi
npm install

# 3. Jalankan mode web dev (Preview di browser)
npm run dev
# Buka http://localhost:5173 di browser Anda.

# 4. Jalankan sebagai Desktop App (Electron)
npm run desktop

# 5. Build Desktop Binaries (.AppImage, .deb, .exe, .dmg)
npm run dist:linux    # Untuk Linux
npm run dist:win      # Untuk Windows
npm run dist:mac      # Untuk macOS

# 6. Menjalankan di Android (Capacitor)
npx cap open android  # Buka di Android Studio
```

---

## 📁 Struktur Direktori

```text
tracker/
├── .github/workflows/    # CI/CD otomatis untuk build rilis multiplatform
├── android/              # Proyek native Android (Capacitor)
├── electron/             # Entrypoint & preload script Electron
│   ├── main.ts
│   └── preload.ts
├── public/               # Logo, ikon multi-resolusi & manifest
├── src/
│   ├── components/       # Komponen UI
│   │   ├── modals/       # Modal Add/Edit Progres, Grup, Proyek, Filter, Backup
│   │   ├── ArchiveView.tsx
│   │   ├── Board.tsx
│   │   ├── CardItemView.tsx
│   │   ├── GroupView.tsx
│   │   ├── Navbar.tsx
│   │   └── ProjectView.tsx
│   ├── store/            # State management & Local Persistence (useTrackerStore.ts)
│   ├── types/            # TypeScript interfaces & types
│   ├── utils/            # Helper tanggal ID, status overdue, label
│   ├── App.tsx           # Main App layout & tabs routing
│   ├── index.css         # Styling Tailwind & Design Tokens
│   └── main.tsx
├── capacitor.config.ts   # Konfigurasi native mobile
├── electron-builder.json # Konfigurasi packaging desktop
├── tailwind.config.js    # Design system tokens
├── vite.config.ts        # Vite + PWA config
└── package.json
```

---

## 🛠️ Tech Stack

* **UI Framework:** React 18 & TypeScript
* **Styling & Design System:** Tailwind CSS & Lucide Icons
* **Kanban Drag & Drop:** `@hello-pangea/dnd`
* **Local Storage & State:** Zustand (dengan reactive persistent storage & JSON backup engine)
* **Desktop Bundle:** Electron & Electron-Builder
* **Mobile Bundle:** Capacitor (Android & iOS native bridge)
* **Web & PWA:** Vite & `vite-plugin-pwa`

---

## 📄 Lisensi

Proyek ini dirilis di bawah lisensi [MIT](LICENSE).
Bebas digunakan, dimodifikasi, dan dibagikan untuk proyek pribadi maupun tim.
