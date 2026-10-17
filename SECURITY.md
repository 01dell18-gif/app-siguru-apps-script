# Kebijakan Keamanan (Security Policy)

---

## Navigasi Dokumentasi Repositori
[📖 README](Readme.md) • [🚀 Panduan Deployment](DEPLOYMENT_GUIDE.md) • [⚙️ Teknik Pembuatan](Teknik%20pembuatan.md) • [🛡️ Security Policy](SECURITY.md) • [⚖️ Lisensi MIT](LICENSE)

---

## Versi yang Didukung

Pembaruan keamanan dan perbaikan rutin secara aktif didukung untuk versi SIGURU berikut:

| Versi | Didukung Keamanan | Catatan |
| :--- | :---: | :--- |
| `v2.x` (Apps Script & Multi-Role RBAC) | :white_check_mark: | Didukung penuh (versi aktif) |
| `< v2.0` | :x: | Versi terdahulu (tidak didukung) |

---

## Standar Keamanan Sistem SIGURU

SIGURU menerapkan arsitektur keamanan berlapis untuk menjamin integritas data sekolah dan kerahasiaan akun:

1. **Role-Based Access Control (RBAC)**:
   - Validasi hak akses bertingkat (*Super Admin*, *Guru*, *Wali Kelas*, *Guru Wali*, *Pembina Ekstra*, dan *Pelihat*).
   - Penguncian fungsi mutasi data (tambah, ubah, hapus, import) bagi peran pelihat/viewer.
   - Pengecekan kepemilikan data pada level backend (`Code.gs`) untuk pembina ekstra dan guru wali.
2. **Perlindungan Akun Utama (*Super Admin*)**:
   - Akun induk `sadmin` terlindungi dari modifikasi sandi oleh pihak non-superadmin.
   - Fitur intip kata sandi akun induk hanya dapat diakses oleh sesi aktif Super Admin.
3. **Penyimpanan Kredensial & Spreadsheet**:
   - Kredensial pengguna dan basis data tersimpan pada Google Spreadsheet yang diatur dengan izin hak akses terbatas (*Restricted Access*).
   - Seluruh pertukaran data antara antarmuka web dan Google Sheets menggunakan enkripsi HTTPS terstandarisasi Google Cloud Platform.
4. **Validasi Input & Sanitasi**:
   - Sanitasi teks terhadap potensi *Cross-Site Scripting* (XSS) pada seluruh rendering tabel dan popup modal.
   - Format NISN 10 digit divalidasi dan diformat otomatis untuk mencegah injeksi karakter ilegal.

---

## Melaporkan Kerentanan Keamanan (Reporting a Vulnerability)

Kami sangat menghargai kontribusi komunitas dan pengembang dalam menjaga keamanan sistem SIGURU. Jika Anda menemukan indikasi celah keamanan:

1. **Jangan membuat Issue publik** untuk celah keamanan yang belum diperbaiki.
2. Silakan laporkan detail temuan melalui fitur **GitHub Private Vulnerability Reporting** pada tab **Security > Report a vulnerability**, atau hubungi tim pengelola repositori secara langsung.
3. Cantumkan informasi lengkap:
   - Deskripsi langkah-langkah reproduksi (*Steps to Reproduce*).
   - Komponen atau berkas terdampak (misal: `Code.gs`, `UserManagement.html`).
   - Potensi dampak terhadap integritas data.
4. Tim pengembang akan meninjau laporan dalam waktu maksimal 2x24 jam dan merilis patch pembaruan secara berkala.
