# PANDUAN DEPLOYMENT & DOKUMENTASI SISTEM: SIGURU APPS SCRIPT

**SIGURU — Sistem Informasi Guru Terpadu (Google Apps Script & Full Google Sheets Database)**  
*Replikasi Penuh dari Sistem Referensi Web (PHP/SQL) ke Arsitektur Serverless Google Cloud (Apps Script & Sheets).*

---

[![README](https://img.shields.io/badge/TAB-📖%20README-grey?style=for-the-badge)](Readme.md)
[![DEPLOYMENT GUIDE](https://img.shields.io/badge/TAB-🚀%20DEPLOYMENT%20GUIDE-orange?style=for-the-badge)](DEPLOYMENT_GUIDE.md)
[![TEKNIK PEMBUATAN](https://img.shields.io/badge/TAB-🏛️%20TEKNIK%20PEMBUATAN-grey?style=for-the-badge)](Teknik%20pembuatan.md)

---

## 📚 Navigasi Dokumentasi Repositori

- 📖 **[Readme Utama (README.md)](Readme.md)**: Ikhtisar sistem, alur modul, dan hak akses.
- 🚀 **[Panduan Deployment (DEPLOYMENT_GUIDE.md)](DEPLOYMENT_GUIDE.md)**: Panduan instalasi Google Apps Script & setup spreadsheet.
- 🏛️ **[Arsitektur & Teknik Pembuatan (Teknik pembuatan.md)](Teknik%20pembuatan.md)**: Arsitektur SPA, Google Sheets database, dan SheetJS.

---

## 📌 1. INFORMASI DATABASE & GOOGLE DRIVE RESMI

Sistem ini telah dikonfigurasi terhubung secara langsung dengan tautan Google Spreadsheet dan Google Drive resmi Anda:

- **ID Google Spreadsheet**: `1QflTpQGL0wwTq-rvu8u__Qzu5fByt3SVrno2vjiX7Zo`  
  *Link Spreadsheet*: [Buka Google Spreadsheet](https://docs.google.com/spreadsheets/d/1QflTpQGL0wwTq-rvu8u__Qzu5fByt3SVrno2vjiX7Zo/edit?usp=sharing)
- **Folder Drive Jurnal Mengajar**: `1g1iaALpfRo8oovkJNoPxy_MIDLv5axEB`
- **Folder Drive Foto Siswa / Profil / Logo / TTD**: `1PmA4EHMEVfgbup9ZJuBrIlFzg37gsQO3`
- **Folder Drive Bimbingan Guru Wali**: `12RUHlItCa8smp58-aixHOTWHld21md9_`
- **Folder Drive Kegiatan Wali Kelas**: `1uNSsLv2rUUC1c_ykBhnkzQ7y43DRxaDj`
- **Folder Drive Kegiatan Ekstrakurikuler**: `1Jf8BcS1jHO1wUYCzk6dQi9_sy7BRyroM`

---

## 🚀 2. LANGKAH DEPLOYMENT KE GOOGLE APPS SCRIPT

### Metode 1: Melalui Editor Web Apps Script (Mudah & Langsung)

1. Buka [script.google.com](https://script.google.com) dan buat **New Project** (Proyek Baru) dengan nama `SIGURU Apps Script`.
2. Gantikan kode di `Code.gs` dengan seluruh isi file `Code.gs` dari folder ini.
3. Buat file-file HTML dengan mengklik tombol **+** di panel kiri > **HTML**, beri nama sesuai dengan 25 file HTML berikut (tanpa mengetikkan ekstensi `.html`):
   - `StyleCSS`
   - `Sidebar`
   - `Header`
   - `AppJS`
   - `Landing`
   - `Login`
   - `Dashboard`
   - `MasterGuru`
   - `MasterMurid`
   - `MasterBimbingan`
   - `MasterEkstra`
   - `FormAbsen`
   - `FormJurnal`
   - `FormGuruWali`
   - `FormWali`
   - `FormEkstra`
   - `LaporanAbsen`
   - `LaporanJurnal`
   - `LaporanGuruWali`
   - `LaporanWali`
   - `LaporanEkstra`
   - `Pengaturan`
   - `UserManagement`
   - `Profil`
   - `PrintLaporan`
4. **Otorisasi Google Drive (PENTING untuk Unggah Foto & Bukti)**:
   - Di toolbar editor Google Apps Script bagian atas, pada dropdown fungsi pilih **`authorizeDriveAccess`**.
   - Klik tombol **▷ Jalankan (Run)**.
   - Kotak dialog **"Otorisasi Diperlukan" (Authorization Required)** akan muncul.
   - Klik **Tinjau Izin (Review Permissions)** > Pilih Akun Google Anda.
   - Jika muncul peringatan *"Google belum memverifikasi aplikasi ini"*, klik **Lanjutan (Advanced)** > klik **Buka SIGURU Apps Script (tidak aman)** > klik **Izinkan (Allow)**.
   - Log eksekusi akan menampilkan status: *"Otorisasi DriveApp Berhasil!"*.
5. Klik **Deploy** (Terapkan) di pojok kanan atas > **New deployment** (Penerapan baru) atau **Manage deployments** > **Edit** > **New version**.
6. Konfigurasi Web App:
   - **Description**: `SIGURU Production v2.7`
   - **Execute as**: `Me` (Akun Google Anda)
   - **Who has access**: `Anyone` (Siapa saja)
7. Klik **Deploy** dan salin URL Web App yang dihasilkan. Aplikasi kini siap digunakan tanpa kendala upload!

### Inisialisasi Database Pertama Kali

Pada saat pertama kali dibuka, sistem otomatis mendeteksi sheet kosong dan menginisialisasi seluruh 11 Sheet beserta header kolomnya:

1. `Pengaturan`
2. `Data User`
3. `Data Guru`
4. `Data Murid`
5. `Data Murid Guru Wali`
6. `Data Murid Ekstra`
7. `Hasil Absen`
8. `Hasil Jurnal`
9. `Hasil Guru Wali`
10. `Hasil Wali`
11. `Hasil Ekstra`

---

## 🔑 3. KREDENSIAL LOGIN DEFAULT

| Username | Password | Hak Akses | Deskripsi |
| --- | --- | --- | --- |
| **`SAdmin`** | `Pengelola@Admin@Super` | **Super Admin** | Akun induk sistem, hak akses mutlak ke seluruh modul dan pengaturan |
| **`viewer`** | `view123` | **Pelihat** | Akun pelihat/pengawas sekolah (hanya dapat melihat laporan) |

> 🛡️ **Proteksi Akun SAdmin**: Akun SAdmin tidak dapat dihapus, username tidak dapat diganti, dan kata sandinya dilindungi secara khusus sehingga Super Admin tambahan lain tidak dapat mengintip kata sandi SAdmin.

---

## 🌟 4. FITUR-FITUR UNGGULAN YANG DIADOPSI DARI REFERENSI

1. **Role-Based Access Control (RBAC) Fleksibel & Multi-Role**:
   - Super Admin, Guru Mapel, Wali Kelas, Guru Wali, Pembina Ekstra, Pelihat (Viewer).
   - Pengguna dapat memiliki kombinasi multi-role (misal: "Guru, Wali Kelas, Pembina Ekstra").
   - **Hak Akses Pelihat (Viewer) pada Seluruh Menu Laporan Hasil**: Pada seluruh 5 menu Laporan Hasil KBM, akun Pelihat diberikan kebebasan memilih nama guru dari dropdown filter untuk keperluan supervisi/pemeriksaan, namun kolom menu Aksi pada tabel laporan terkunci permanen (`🔒 Terkunci`) serta aksi edit dan hapus dilindungi secara ketat (read-only).
   - **Pemetaan Multi-Pembina & Seleksi Guru di Master Ekstrakurikuler**: Jika siswa mengikuti lebih dari satu cabang ekstra, sistem memetakan guru pembina untuk masing-masing cabang. Jika suatu cabang ekstra memiliki lebih dari 1 guru pembina terdaftar di sistem, pengguna dapat memilih salah satu guru pembinanya melalui dropdown saat tambah/edit data. Aksi edit dan hapus dapat dilakukan oleh Super Admin serta guru pembina siswa terkait.
   - **Otomasi Cabang & Presensi Formulir Ekstrakurikuler**: Pada Formulir Kegiatan Ekstrakurikuler, cabang ekstrakurikuler otomatis terisi sesuai penugasan pembina ekstra akun guru yang login (dikunci jika membina tepat 1 cabang, dapat dipilih di antara cabang binaan jika membina lebih dari 1 cabang). Presensi siswa secara akurat menyaring siswa yang terdaftar pada cabang ekstra tersebut.
2. **Auto-Hiding Navbar & Real-Time Device Clock**:
   - Header modern yang otomatis menyusut saat di-scroll ke bawah dan muncul saat di-scroll ke atas.
   - Jam & tanggal real-time sesuai perangkat pengguna (klien).
   - Tombol cepat Refresh, Hapus Cache, dan Profile Avatar.
3. **Master Data Induk Siswa & Quick Status Checkbox**:
   - Checkbox cepat (*Murid, Guru Wali, Wali Kelas, Ekstra*) dengan auto-sync otomatis ke tabel bimbingan dan ekstra.
   - Lightbox foto siswa pratinjau resolusi penuh.
4. **Formulir Presensi Cepat (Segmented Buttons H/I/S/A/D)**:
   - Segmented buttons per siswa: 🟢 Hadir, 🟡 Izin, 🔵 Sakit, 🔴 Alpha, 🟣 Dispen.
   - Tombol sakti *"Tandai Semua Hadir"*.
   - Auto-replace riwayat jika ada koreksi presensi di hari/kelas/mapel yang sama.
5. **Jurnal Mengajar KBM Cerdas**:
   - Penghitung otomatis *Pertemuan Ke* berdasarkan riwayat KBM guru, mapel, dan kelas.
   - Pilihan model pembelajaran dan ketuntasan materi.
   - Integrasi unggah dokumentasi langsung ke folder Google Drive Jurnal.
6. **Bimbingan Guru Wali & WhatsApp Ortu Terhubung**:
   - Integrasi nomor WhatsApp siswa & wali murid dengan tautan direct-chat `wa.me`.
   - Unggah foto bimbingan ke Google Drive.
7. **Laporan & Cetak PDF Resmi di Tab Baru**:
   - Dibuka langsung pada tab baru browser dengan pratinjau yang responsif.
   - Kop Surat Resmi Sekolah yang fleksibel: mendukung Gambar Kop Surat Resmi dari menu Pengaturan maupun format teks dengan logo sekolah.
   - Pilihan orientasi cetak: Portrait (Tegak) atau Landscape (Mendatar).
   - Tanda tangan seimbang dan proporsional (Kepala Sekolah di kiri dan Guru di kanan masing-masing rata tengah, serta format khusus presensi siswa).
   - Ringkasan efektivitas mengajar KBM (% capaian terhadap target pertemuan).
   - Tautan bukti / berkas aktif (mendukung multi-link berkas Google Drive).
8. **Pengaturan Sistem & Tombol Sakti Pembersihan Database**:
   - Tag Manager Tahun Ajaran, Kelas, Mapel, dan Ekstra dengan tombol tambah dan tombol "x" hapus dinamis.
   - Dukungan Export, Import, dan Unduh Template format Excel (.xlsx).
   - Tombol Sakti: *"Hapus Data"* untuk pembersihan database periode baru dengan konfirmasi ganda:
     - Menghapus seluruh berkas lampiran (foto, gambar, dokumen bukti) terkait di Google Drive secara otomatis.
     - Mengosongkan data transaksi harian dan master data siswa/guru.
     - Membersihkan akun pengguna di Manajemen User & Hak Akses (RBAC) dengan proteksi khusus hak akses **Super Admin** dan **Pelihat** agar tidak terhapus.
     - Menyimpan kembali data default untuk: **Identitas Sekolah & Periode Akademik**, **Kop Surat & Tanda Tangan Digital**, serta **Folder Penyimpanan Google Drive** di database.
9. **Ekspor, Impor, & Template Format Excel (.xlsx)**:
   - Dukungan penuh format Excel asli (.xlsx) menggunakan SheetJS pada semua Master Data, Formulir, Pengaturan, dan Laporan.
   - Ekspor data bersih dan template siap pakai dengan header otomatis.

10. **Proteksi Keamanan Akses URL & Guard Autentikasi Instan (Zero-Flicker Protection)**:
    - Mencegah akses tanpa login melalui manipulasi/pengetikan langsung URL (seperti `?page=form-absen`, `?page=dashboard`, dll.).
    - Pelindung instan di `<head>` ([StyleCSS.html](file:///g:/Download%20File/Coba/Siguru%20Apps%20Script/StyleCSS.html)) dieksekusi sebelum peramban menampilkan DOM (0 piksel/flicker), langsung menyembunyikan halaman dan mengalihkan peramban ke halaman login dengan pesan ramah *"Sesi Belum Aktif"*.
    - Target menu awal disimpan sementara di `sessionStorage` (`siguru_redirect_target`), sehingga setelah login berhasil, pengguna dapat langsung diantar kembali ke menu yang dituju.
    - Penegakan Hak Akses (RBAC) pada URL: Memblokir pengguna dengan hak akses terbatas yang mencoba mengakses menu terlarang secara manual dan mengarahkan mereka kembali ke menu resminya.

11. **Upload Foto Profil Pengguna ala Web & Sinkronisasi Global**:
    - Antarmuka avatar profil interaktif dengan efek *hover overlay* (*"Ubah Foto"*), tombol badge kamera, aksi cepat upload/hapus foto, dan pratinjau lokal instan (`FileReader`).
    - Foto otomatis diunggah ke Google Drive **Folder Foto** (`02_Foto_Logo_TTD`) dan tautan thumbnail langsung dicatat di sheet **`Data User`** pada kolom `foto`.
    - Sinkronisasi avatar profil seketika di bagian atas **Header** dan pojok bawah **Sidebar** tanpa perlu memuat ulang peramban secara manual.
    - Otomatis membersihkan berkas lama di Google Drive saat foto diganti atau dihapus (*drive auto-trash*).

12. **Pencarian Cepat Siswa dari Data Induk & Filter Belum Digunakan**:
    - Pemilihan siswa dari Data Induk pada Master Bimbingan (Guru Wali) dan Master Siswa Ekstrakurikuler dapat diketik langsung (pencarian nama siswa atau NISN) menggunakan *searchable datalist*.
    - Sistem otomatis melakukan pengecekan data induk dan **hanya menyajikan data siswa yang belum pernah didaftarkan (belum digunakan)** guna mencegah duplikasi.

13. **Multi-Pembina Ekstrakurikuler pada Master Guru & Formulir Terintegrasi**:
    - **Master Data Guru**: Mendukung penugasan lebih dari 1 cabang kegiatan ekstrakurikuler untuk satu guru melalui antarmuka checkbox multi-pilihan (*Pilih Semua* & *Kosongkan*), pencarian cabang ekstra yang dapat diketik langsung, serta tombol **Tambah Ekstra** untuk menambah cabang baru ke sistem secara instan.
    - **Formulir Kegiatan Ekstrakurikuler**: Dropdown cabang terbuka dan dapat dipilih jika guru membina lebih dari 1 kegiatan ekstra, lengkap dengan badge keterangan jumlah cabang binaan.
    - **Data Siswa Ekstrakurikuler**: Menyediakan dropdown pemilihan guru pembina per cabang jika suatu cabang ekstra memiliki lebih dari 1 guru pembina terdaftar di sistem.

14. **Pencarian Kelas yang Dapat Diketik (*Typeable Class Search*)**:
    - Input **Sebagai Wali Kelas** pada Master Data Guru dan input **Kelas / Rombel** pada Master Data Siswa kini dilengkapi fitur pencarian yang dapat diketik langsung (*searchable select*), mempermudah dan mempercepat pemilihan kelas di antara puluhan rombel terdaftar.

15. **Repeater Cabang Ekstrakurikuler & Seleksi Guru Pembina Dinamis (`MasterEkstra.html`)**:
    - Pada modal tambah dan edit siswa ekstrakurikuler, penambahan cabang menggunakan format **kartu baris dinamis (*repeater card*)** dengan tombol **[+ Tambah Cabang]**.
    - Setiap baris memiliki kolom input pencarian cabang yang dapat diketik langsung (*typeable search*), tombol chevron dropdown pilihan cabang terdaftar, serta badge penanda `[Bisa Diketik]`.
    - Kolom **Guru Pembina** otomatis menampilkan status terkunci `⊝ Pilih cabang ekstra dulu` saat cabang belum ditentukan. Begitu cabang dipilih, jika cabang memiliki **lebih dari 1 guru pembina terdaftar**, sistem menyajikan dropdown seleksi guru pembina sehingga pengguna dapat memilih salah satu guru pembinanya.
    - Dilengkapi tombol hapus baris `[ 🗑 ]` (dengan pemulihan baris otomatis jika seluruh kartu terhapus) serta validasi pencegahan duplikasi cabang ekstra pada satu siswa yang sama.

---

## 🛠️ 5. PANDUAN PENERAPAN KE GOOGLE SPREADSHEET LAIN

Jika sistem ini ingin diduplikasi atau dipindahkan ke akun/spreadsheet sekolah lain:

1. **Ubah `SPREADSHEET_ID` di `Code.gs` (Baris 7)**:
   - Buat Google Spreadsheet baru.
   - Salin ID Spreadsheet dari URL browser: `https://docs.google.com/spreadsheets/d/`**`[SPREADSHEET_ID]`**`/edit`.
   - Gantikan nilai `const SPREADSHEET_ID = '...'` di `Code.gs`.
   - *Catatan*: Tabel dan 11 nama sheet akan terbuat secara otomatis saat web app pertama kali dibuka.

2. **Buat 5 Folder di Google Drive**:
   - `01_Berkas_Jurnal` *(untuk bukti KBM guru)*
   - `02_Foto_Logo_TTD` *(untuk foto siswa, foto profil pengguna, logo instansi, dan ttd kepsek)*
   - `03_Berkas_Bimbingan` *(untuk dokumentasi konseling guru wali)*
   - `04_Berkas_Wali_Kelas` *(untuk dokumentasi kegiatan wali kelas)*
   - `05_Berkas_Ekstrakurikuler` *(untuk dokumentasi kegiatan ekstra)*
   - Pastikan hak akses folder diatur ke *"Siapa saja yang memiliki tautan sebagai Pelihat (Viewer)"*.

3. **Atur Link Folder & Aset di Menu Pengaturan Sistem**:
   - Login ke Web App sebagai `SAdmin` (Password: `Pengelola@Admin@Super`).
   - Buka menu **Pengaturan Sistem**.
   - Masukkan masing-masing URL folder Google Drive ke kolomnya.
   - Masukkan URL / upload Logo Sekolah, Gambar Kop Surat Resmi, dan TTD Kepala Sekolah.
   - Simpan Pengaturan.

4. **(Opsional) Fallback Default di `Code.gs` (Baris 303-325)**:
   - Anda juga dapat mengisi nilai default langsung pada fungsi `getSettings()` di `Code.gs`.
