// ============================================================
// Code.gs - SIGURU Apps Script (Server-Side Main Controller)
// Sistem Informasi Guru — Full Google Sheets Database
// ============================================================

// === KONFIGURASI SPREADSHEET ===
const SPREADSHEET_ID = '1QflTpQGL0wwTq-rvu8u__Qzu5fByt3SVrno2vjiX7Zo';

// Nama Sheet di Spreadsheet
const SHEET_NAMES = {
  PENGATURAN: 'Pengaturan',
  DATA_USER: 'Data User',
  DATA_GURU: 'Data Guru',
  DATA_MURID: 'Data Murid',
  DATA_MURID_GURU_WALI: 'Data Murid Guru Wali',
  DATA_MURID_EKSTRA: 'Data Murid Ekstra',
  HASIL_ABSEN: 'Hasil Absen',
  HASIL_JURNAL: 'Hasil Jurnal',
  HASIL_GURU_WALI: 'Hasil Guru Wali',
  HASIL_WALI: 'Hasil Wali',
  HASIL_EKSTRA: 'Hasil Ekstra'
};

// === ROUTING & WEB APP ===
let _activePage = 'landing';
let _activeParams = {};

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? e.parameter.page : 'landing';
  const userJson = (e && e.parameter && e.parameter.user) ? e.parameter.user : '';
  _activePage = page;
  _activeParams = (e && e.parameter) ? e.parameter : {};
  
  let template;
  switch(page) {
    case 'landing':
      template = HtmlService.createTemplateFromFile('Landing');
      break;
    case 'login':
      template = HtmlService.createTemplateFromFile('Login');
      break;
    case 'dashboard':
      template = HtmlService.createTemplateFromFile('Dashboard');
      break;
    case 'master-guru':
      template = HtmlService.createTemplateFromFile('MasterGuru');
      break;
    case 'master-murid':
      template = HtmlService.createTemplateFromFile('MasterMurid');
      break;
    case 'master-bimbingan':
      template = HtmlService.createTemplateFromFile('MasterBimbingan');
      break;
    case 'master-ekstra':
      template = HtmlService.createTemplateFromFile('MasterEkstra');
      break;
    case 'form-absen':
      template = HtmlService.createTemplateFromFile('FormAbsen');
      break;
    case 'form-jurnal':
      template = HtmlService.createTemplateFromFile('FormJurnal');
      break;
    case 'form-guruwali':
      template = HtmlService.createTemplateFromFile('FormGuruWali');
      break;
    case 'form-wali':
      template = HtmlService.createTemplateFromFile('FormWali');
      break;
    case 'form-ekstra':
      template = HtmlService.createTemplateFromFile('FormEkstra');
      break;
    case 'laporan-absen':
      template = HtmlService.createTemplateFromFile('LaporanAbsen');
      break;
    case 'laporan-jurnal':
      template = HtmlService.createTemplateFromFile('LaporanJurnal');
      break;
    case 'laporan-guruwali':
      template = HtmlService.createTemplateFromFile('LaporanGuruWali');
      break;
    case 'laporan-wali':
      template = HtmlService.createTemplateFromFile('LaporanWali');
      break;
    case 'laporan-ekstra':
      template = HtmlService.createTemplateFromFile('LaporanEkstra');
      break;
    case 'pengaturan':
      template = HtmlService.createTemplateFromFile('Pengaturan');
      break;
    case 'user-management':
      template = HtmlService.createTemplateFromFile('UserManagement');
      break;
    case 'profil':
      template = HtmlService.createTemplateFromFile('Profil');
      break;
    case 'print-laporan':
      template = HtmlService.createTemplateFromFile('PrintLaporan');
      break;
    default:
      template = HtmlService.createTemplateFromFile('Landing');
  }
  
  // Expose URL parameters, active page, and scriptUrl to template
  template.params = _activeParams;
  template.scriptUrl = getScriptUrl();
  template.currentPage = page;
  
  return template.evaluate()
    .setTitle('SIGURU — Sistem Informasi Guru')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

// Bundle data lengkap untuk memuat halaman secara instan (0 detik tanpa loading berulang)
function getAppBundle() {
  try {
    const settings = getSettings();
    const guru = getSheetData(SHEET_NAMES.DATA_GURU);
    const bimbingan = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const rawMurid = getSheetData(SHEET_NAMES.DATA_MURID);

    // Hubungkan foto_murid dari data bimbingan / guru wali ke data induk siswa
    const fotoMap = {};
    bimbingan.forEach(b => {
      const f = b.foto_murid || b.foto || '';
      if (b.nisn && f) fotoMap[String(b.nisn).trim()] = f;
      if (b.nama_murid && f) fotoMap[String(b.nama_murid).trim().toLowerCase()] = f;
    });
    const murid = rawMurid.map(m => {
      m.foto_murid = m.foto_murid || fotoMap[String(m.nisn).trim()] || fotoMap[String(m.nama_murid).trim().toLowerCase()] || '';
      return m;
    });

    const kelasList = getDaftarKelas();
    const mapelList = getDaftarMapel();
    const taList = getDaftarTahunAjaran();
    const ekstraList = getDaftarEkstra();
    const guruNamaList = guru.map(g => ({ nama: g.nama_guru, nip: g.nip, pembina_ekstra: g.pembina_ekstra }));

    return {
      settings: settings,
      kelas: kelasList,
      mapel: mapelList,
      tahunAjaran: taList,
      ekstra: ekstraList,
      guru: guru,
      guruNama: guruNamaList,
      murid: murid,
      bimbingan: bimbingan,
      muridEkstra: getSheetData(SHEET_NAMES.DATA_MURID_EKSTRA),
      timestamp: new Date().getTime()
    };
  } catch(err) {
    Logger.log('Error in getAppBundle: ' + err.message);
    return {
      settings: {},
      kelas: [],
      mapel: [],
      tahunAjaran: [],
      ekstra: [],
      guru: [],
      guruNama: [],
      murid: [],
      bimbingan: [],
      muridEkstra: [],
      error: err.message,
      timestamp: new Date().getTime()
    };
  }
}

// Endpoint bundle khusus Siswa Bimbingan Guru Wali
function getBundleBimbingan() {
  return getAppBundle();
}

// Dapatkan Web App URL resmi untuk navigasi & cetak
function getScriptUrl() {
  try {
    return ScriptApp.getService().getUrl();
  } catch(e) {
    return '';
  }
}

// Include file HTML partial (dengan evaluasi template, scriptUrl, currentPage, & params)
function include(filename, data) {
  const t = HtmlService.createTemplateFromFile(filename);
  t.scriptUrl = getScriptUrl();
  t.currentPage = _activePage;
  t.params = _activeParams;
  if (data && typeof data === 'object') {
    for (const k in data) t[k] = data[k];
  }
  return t.evaluate().getContent();
}

// === UTILITAS SPREADSHEET ===
let _cachedSpreadsheet = null;
function getSpreadsheet() {
  if (!_cachedSpreadsheet) {
    _cachedSpreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return _cachedSpreadsheet;
}

function getSheet(sheetName) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    initializeSheet(sheet, sheetName);
  }
  return sheet;
}

function initializeSheet(sheet, sheetName) {
  const headers = getHeaders(sheetName);
  if (headers && headers.length > 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
}

function getHeaders(sheetName) {
  switch(sheetName) {
    case SHEET_NAMES.PENGATURAN:
      return ['id','logo','nama_sekolah','tahun_ajaran','list_tahun_ajaran','semester','kelas','mata_pelajaran','folder_jurnal','folder_foto','folder_guru_wali','folder_wali','folder_ekstra','list_ekstrakurikuler','kepala_sekolah','nip_kepala_sekolah','kop_surat','kop_size','kabupaten','ttd_kepsek'];
    case SHEET_NAMES.DATA_USER:
      return ['id','username','password','hak_akses','nama','nip'];
    case SHEET_NAMES.DATA_GURU:
      return ['id','nama_guru','nip','sebagai_guru_wali','sebagai_wali_kelas','pembina_ekstra'];
    case SHEET_NAMES.DATA_MURID:
      return ['id','nisn','nama_murid','jenis_kelamin','kelas','status'];
    case SHEET_NAMES.DATA_MURID_GURU_WALI:
      return ['id','nisn','nama_murid','kelas','jenis_kelamin','foto_murid','guru_wali','no_wa_murid','nama_ortu','kontak_ortu','catatan_khusus'];
    case SHEET_NAMES.DATA_MURID_EKSTRA:
      return ['id','nisn','nama_murid','jenis_kelamin','kelas','nama_ekstra','nama_guru'];
    case SHEET_NAMES.HASIL_ABSEN:
      return ['id','tanggal','tahun_ajaran','semester','nisn','nama_murid','jenis_kelamin','kelas','keterangan','mata_pelajaran','nama_guru','created_at'];
    case SHEET_NAMES.HASIL_JURNAL:
      return ['id','tanggal','tahun_ajaran','semester','nama_guru','mata_pelajaran','jam_ke','kelas','pertemuan_ke','model_pembelajaran','materi_pembelajaran','murid_tidak_hadir','ketuntasan_materi','keterangan_tuntas','link_bukti_jurnal','created_at'];
    case SHEET_NAMES.HASIL_GURU_WALI:
      return ['id','tanggal','tahun_ajaran','semester','nama_guru_wali','nama_murid','kategori','topik_masalah','tindak_lanjut','keterangan','file_bukti','created_at'];
    case SHEET_NAMES.HASIL_WALI:
      return ['id','tanggal','tahun_ajaran','semester','kelas','nama_wali_kelas','deskripsi_kegiatan','link_bukti_wali','created_at'];
    case SHEET_NAMES.HASIL_EKSTRA:
      return ['id','tanggal','tahun_ajaran','semester','nama_murid','kegiatan_ekstra','keterangan','link_bukti_ekstra','pembina_ekstra','created_at'];
    default:
      return [];
  }
}

// Get all data dari sheet sebagai array of objects
function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      let val = data[i][j];
      const colName = String(headers[j] || '').trim();
      if (!colName) continue;

      // Format tanggal
      if (val instanceof Date) {
        val = Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } else if (colName === 'tanggal' && typeof val === 'number' && val > 20000 && val < 60000) {
        try {
          const dateObj = new Date(Math.round((val - 25569) * 86400 * 1000));
          val = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        } catch(e) {}
      } else if (colName === 'nisn' || colName === 'no_wa_murid' || colName === 'kontak_ortu' || colName === 'nip') {
        // Konversi nomor telepon / NISN / NIP ke string bersih (cegah notasi ilmiah seperti 8.1234567E7)
        if (val !== null && val !== undefined && val !== '') {
          val = String(val).trim();
          if (val.includes('E') || val.includes('e')) {
            try { val = BigInt(Math.round(Number(val))).toString(); } catch(e) {}
          }
        } else {
          val = '';
        }
      }
      row[colName] = val;
    }
    row._rowIndex = i + 1; // Baris di spreadsheet (1-indexed)
    rows.push(row);
  }
  return rows;
}

// Generate ID baru
function getNextId(sheetName) {
  const data = getSheetData(sheetName);
  if (data.length === 0) return 1;
  const maxId = Math.max(...data.map(r => parseInt(r.id) || 0));
  return maxId + 1;
}

// === AUTENTIKASI ===
function loginUser(username, password) {
  try {
    const users = getSheetData(SHEET_NAMES.DATA_USER);
    const user = users.find(u => 
      String(u.username).trim().toLowerCase() === String(username).trim().toLowerCase() && 
      String(u.password).trim() === String(password).trim()
    );
    
    if (user) {
      let waliKelas = '-';
      let guruWali = '-';
      let pembinaEkstra = '-';

      try {
        const guruList = getSheetData(SHEET_NAMES.DATA_GURU) || [];
        const userNip = String(user.nip || '').trim();
        const userNama = String(user.nama || '').trim().toLowerCase();

        const matchG = guruList.find(g => {
          const gNip = String(g.nip || '').trim();
          const gNama = String(g.nama_guru || '').trim().toLowerCase();
          return (userNip && gNip && userNip === gNip) || (userNama && gNama && userNama === gNama);
        });

        if (matchG) {
          waliKelas = matchG.sebagai_wali_kelas || '-';
          guruWali = matchG.sebagai_guru_wali || '-';
          pembinaEkstra = matchG.pembina_ekstra || '-';
        }
      } catch(errGuru) {
        Logger.log('Could not load guru data during login: ' + errGuru.message);
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          nama: user.nama,
          nip: user.nip || '',
          hak_akses: user.hak_akses,
          sebagai_wali_kelas: waliKelas,
          sebagai_guru_wali: guruWali,
          pembina_ekstra: pembinaEkstra
        }
      };
    }
    return { success: false, message: 'Username atau password salah!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === PENGATURAN ===
function getDefaultSettingsObject() {
  return {
    id: 1,
    logo: 'https://drive.google.com/thumbnail?id=1GUfUommgYjV-cnhU0tTB8kRJy8iXagkI',
    nama_sekolah: 'SMK NEGERI 1 CONTOH',
    tahun_ajaran: '2026/2027',
    list_tahun_ajaran: '["2025/2026", "2026/2027", "2027/2028"]',
    semester: 'Ganjil',
    kelas: 'X RPL 1, X RPL 2, XI RPL 1, XI RPL 2, XII RPL 1, XII RPL 2',
    mata_pelajaran: 'Matematika, Bahasa Indonesia, Pemrograman Web, Basis Data, Bahasa Inggris',
    folder_jurnal: 'https://drive.google.com/drive/folders/1g1iaALpfRo8oovkJNoPxy_MIDLv5axEB?usp=drive_link',
    folder_foto: 'https://drive.google.com/drive/folders/1PmA4EHMEVfgbup9ZJuBrIlFzg37gsQO3?usp=sharing',
    folder_guru_wali: 'https://drive.google.com/drive/folders/12RUHlItCa8smp58-aixHOTWHld21md9_?usp=drive_link',
    folder_wali: 'https://drive.google.com/drive/folders/1uNSsLv2rUUC1c_ykBhnkzQ7y43DRxaDj?usp=drive_link',
    folder_ekstra: 'https://drive.google.com/drive/folders/1Jf8BcS1jHO1wUYCzk6dQi9_sy7BRyroM?usp=drive_link',
    list_ekstrakurikuler: 'Pramuka, Paskibra, Futsal, Basket, Rohis, PMR',
    kepala_sekolah: 'Drs. H. Ahmad Fauzi, M.Pd.',
    nip_kepala_sekolah: '19750815 199903 1 002',
    kop_surat: 'https://drive.google.com/thumbnail?id=1Z80pVGJv9v-GFwjE1_kBi_G9uRlR2gN7',
    kop_size: '90',
    kabupaten: 'Klungkung',
    ttd_kepsek: 'https://drive.google.com/thumbnail?id=1GUfUommgYjV-cnhU0tTB8kRJy8iXagkI'
  };
}

function getSettings() {
  const data = getSheetData(SHEET_NAMES.PENGATURAN);
  if (data.length > 0) return data[0];
  return getDefaultSettingsObject();
}

function saveSettings(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.PENGATURAN);
    const headers = getHeaders(SHEET_NAMES.PENGATURAN);
    const existing = getSettings();
    
    // Otomatis hapus/ganti file lama di Google Drive jika logo, kop surat, atau ttd kepsek diganti
    ['logo', 'kop_surat', 'ttd_kepsek'].forEach(field => {
      if (formData[field] !== undefined && existing[field]) {
        syncDriveFileReplacement(existing[field], formData[field]);
      }
    });

    const data = sheet.getDataRange().getValues();
    const rowValues = headers.map(h => formData[h] !== undefined ? formData[h] : '');
    rowValues[0] = 1; // id selalu 1
    
    if (data.length <= 1) {
      sheet.appendRow(rowValues);
    } else {
      sheet.getRange(2, 1, 1, rowValues.length).setValues([rowValues]);
    }
    return { success: true, message: 'Pengaturan berhasil disimpan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === DASHBOARD DATA ===
function getDashboardData() {
  try {
    const countGuru = getSheetData(SHEET_NAMES.DATA_GURU).length;
    const countMurid = getSheetData(SHEET_NAMES.DATA_MURID).length;
    const absenData = getSheetData(SHEET_NAMES.HASIL_ABSEN);
    const countJurnal = getSheetData(SHEET_NAMES.HASIL_JURNAL).length;
    const countGuruWali = getSheetData(SHEET_NAMES.HASIL_GURU_WALI).length;
    const countWali = getSheetData(SHEET_NAMES.HASIL_WALI).length;
    const countEkstra = getSheetData(SHEET_NAMES.HASIL_EKSTRA).length;
    
    // Statistik Presensi
    const statH = absenData.filter(r => r.keterangan === 'H').length;
    const statI = absenData.filter(r => r.keterangan === 'I').length;
    const statS = absenData.filter(r => r.keterangan === 'S').length;
    const statA = absenData.filter(r => r.keterangan === 'A').length;
    const statD = absenData.filter(r => r.keterangan === 'D').length;
    
    // Aktivitas Terbaru
    const recentJurnal = getSheetData(SHEET_NAMES.HASIL_JURNAL).slice(-5).reverse();
    const recentBimbingan = getSheetData(SHEET_NAMES.HASIL_GURU_WALI).slice(-5).reverse();
    const recentWali = getSheetData(SHEET_NAMES.HASIL_WALI).slice(-5).reverse();
    const recentEkstra = getSheetData(SHEET_NAMES.HASIL_EKSTRA).slice(-5).reverse();
    
    const settings = getSettings();
    
    return {
      countGuru, countMurid, countAbsen: absenData.length,
      countJurnal, countGuruWali, countWali, countEkstra,
      statH, statI, statS, statA, statD,
      recentJurnal, recentBimbingan, recentWali, recentEkstra,
      settings
    };
  } catch(e) {
    return { error: e.message };
  }
}

// === MASTER DATA GURU - CRUD ===
function getDataGuru() {
  return getSheetData(SHEET_NAMES.DATA_GURU);
}

function addDataGuru(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_GURU);
    const newId = getNextId(SHEET_NAMES.DATA_GURU);
    sheet.appendRow([
      newId,
      formData.nama_guru || '',
      formData.nip || '',
      formData.sebagai_guru_wali || 'Tidak',
      formData.sebagai_wali_kelas || '-',
      formData.pembina_ekstra || '-'
    ]);
    return { success: true, message: 'Data guru berhasil ditambahkan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateDataGuru(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_GURU);
    const data = getSheetData(SHEET_NAMES.DATA_GURU);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    sheet.getRange(row._rowIndex, 1, 1, 6).setValues([[
      formData.id,
      formData.nama_guru || '',
      formData.nip || '',
      formData.sebagai_guru_wali || 'Tidak',
      formData.sebagai_wali_kelas || '-',
      formData.pembina_ekstra || '-'
    ]]);
    return { success: true, message: 'Data guru berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteDataGuru(id) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_GURU);
    const data = getSheetData(SHEET_NAMES.DATA_GURU);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Data guru berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === MASTER DATA MURID - CRUD ===
function getDataMurid() {
  const murid = getSheetData(SHEET_NAMES.DATA_MURID);
  const bimbingan = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
  const fotoMap = {};
  bimbingan.forEach(b => {
    if (b.nisn && b.foto_murid) fotoMap[String(b.nisn).trim()] = b.foto_murid;
    if (b.nama_murid && b.foto_murid) fotoMap[String(b.nama_murid).trim().toLowerCase()] = b.foto_murid;
  });
  return murid.map(m => {
    m.foto_murid = fotoMap[String(m.nisn).trim()] || fotoMap[String(m.nama_murid).trim().toLowerCase()] || '';
    return m;
  });
}

function addDataMurid(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID);
    const newId = getNextId(SHEET_NAMES.DATA_MURID);
    const st = formData.status || 'Murid';
    sheet.appendRow([
      newId,
      formData.nisn || '',
      formData.nama_murid || '',
      formData.jenis_kelamin || 'L',
      formData.kelas || '',
      st
    ]);

    // Sinkronisasi otomatis ke data_murid_guru_wali jika berstatus 'Guru Wali'
    if (st.indexOf('Guru Wali') !== -1) {
      const gwSheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
      const newGwId = getNextId(SHEET_NAMES.DATA_MURID_GURU_WALI);
      gwSheet.appendRow([newGwId, formData.nisn || '', formData.nama_murid || '', formData.kelas || '', formData.jenis_kelamin || 'L', '', 'Belum Ditentukan', '', '', '', '']);
    }

    // Sinkronisasi otomatis ke data_murid_ekstra jika berstatus 'Ekstra'
    if (st.indexOf('Ekstra') !== -1) {
      const ekSheet = getSheet(SHEET_NAMES.DATA_MURID_EKSTRA);
      const newEkId = getNextId(SHEET_NAMES.DATA_MURID_EKSTRA);
      ekSheet.appendRow([newEkId, formData.nisn || '', formData.nama_murid || '', formData.jenis_kelamin || 'L', formData.kelas || '', 'Pramuka', '']);
    }

    return { success: true, message: 'Data siswa berhasil ditambahkan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateDataMurid(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID);
    const data = getSheetData(SHEET_NAMES.DATA_MURID);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    sheet.getRange(row._rowIndex, 1, 1, 6).setValues([[
      formData.id,
      formData.nisn || '',
      formData.nama_murid || '',
      formData.jenis_kelamin || 'L',
      formData.kelas || '',
      formData.status || 'Murid'
    ]]);
    return { success: true, message: 'Data siswa berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteDataMurid(id) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID);
    const data = getSheetData(SHEET_NAMES.DATA_MURID);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Bersihkan juga dari DATA_MURID_GURU_WALI dan hapus foto murid di Google Drive jika ada
    try {
      const gwSheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
      const gwData = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
      const gwRow = gwData.find(g => String(g.nisn).trim() === String(row.nisn).trim());
      if (gwRow) {
        if (gwRow.foto_murid) {
          deleteDriveFiles(gwRow.foto_murid);
        }
        gwSheet.deleteRow(gwRow._rowIndex);
      }
    } catch(errGw) {
      Logger.log('Info bersihkan bimbingan murid: ' + errGw.message);
    }

    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Data siswa berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateStatusMurid(id, status) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID);
    const data = getSheetData(SHEET_NAMES.DATA_MURID);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Kolom status ada di index ke-6 (kolom F)
    sheet.getRange(row._rowIndex, 6).setValue(status);

    // Sinkronisasi otomatis ke data_murid_guru_wali jika berstatus 'Guru Wali'
    if (status.indexOf('Guru Wali') !== -1) {
      const gwSheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
      const gwData = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
      const exists = gwData.some(g => String(g.nisn).trim() === String(row.nisn).trim() || String(g.nama_murid).trim().toLowerCase() === String(row.nama_murid).trim().toLowerCase());
      if (!exists) {
        const newGwId = getNextId(SHEET_NAMES.DATA_MURID_GURU_WALI);
        gwSheet.appendRow([newGwId, row.nisn || '', row.nama_murid || '', row.kelas || '', row.jenis_kelamin || 'L', '', 'Belum Ditentukan', '', '', '', '']);
      }
    }

    // Sinkronisasi otomatis ke data_murid_ekstra jika berstatus 'Ekstra'
    if (status.indexOf('Ekstra') !== -1) {
      const ekSheet = getSheet(SHEET_NAMES.DATA_MURID_EKSTRA);
      const ekData = getSheetData(SHEET_NAMES.DATA_MURID_EKSTRA);
      const exists = ekData.some(e => String(e.nisn).trim() === String(row.nisn).trim() || String(e.nama_murid).trim().toLowerCase() === String(row.nama_murid).trim().toLowerCase());
      if (!exists) {
        const newEkId = getNextId(SHEET_NAMES.DATA_MURID_EKSTRA);
        ekSheet.appendRow([newEkId, row.nisn || '', row.nama_murid || '', row.jenis_kelamin || 'L', row.kelas || '', 'Pramuka', '']);
      }
    }

    return { success: true, message: 'Status berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === MASTER DATA MURID GURU WALI - CRUD ===
function getDataMuridGuruWali() {
  return getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
}

function addDataMuridGuruWali(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const newId = getNextId(SHEET_NAMES.DATA_MURID_GURU_WALI);
    sheet.appendRow([
      newId,
      formData.nisn || '',
      formData.nama_murid || '',
      formData.kelas || '',
      formData.jenis_kelamin || 'L',
      formData.foto_murid || '',
      formData.guru_wali || '',
      formData.no_wa_murid || '',
      formData.nama_ortu || '',
      formData.kontak_ortu || '',
      formData.catatan_khusus || ''
    ]);
    return { success: true, message: 'Data bimbingan berhasil ditambahkan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateDataMuridGuruWali(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const data = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Jika foto murid diganti atau dihapus, hapus file lama di Google Drive
    if (formData.foto_murid !== undefined && row.foto_murid) {
      syncDriveFileReplacement(row.foto_murid, formData.foto_murid);
    }

    const headers = getHeaders(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const values = headers.map(h => formData[h] !== undefined ? formData[h] : (row[h] || ''));
    
    sheet.getRange(row._rowIndex, 1, 1, values.length).setValues([values]);
    return { success: true, message: 'Data bimbingan berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteDataMuridGuruWali(id) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const data = getSheetData(SHEET_NAMES.DATA_MURID_GURU_WALI);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Hapus foto murid di Google Drive jika ada
    if (row.foto_murid) {
      deleteDriveFiles(row.foto_murid);
    }

    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Data bimbingan berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === MASTER DATA MURID EKSTRA - CRUD ===
function getDataMuridEkstra() {
  return getSheetData(SHEET_NAMES.DATA_MURID_EKSTRA);
}

function addDataMuridEkstra(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_EKSTRA);
    const newId = getNextId(SHEET_NAMES.DATA_MURID_EKSTRA);

    // Pastikan header nama_guru ada di baris 1
    const lastCol = Math.max(sheet.getLastColumn(), 6);
    const headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim().toLowerCase());
    if (!headerVals.includes('nama_guru')) {
      sheet.getRange(1, lastCol + 1).setValue('nama_guru').setFontWeight('bold');
    }

    sheet.appendRow([
      newId,
      formData.nisn || '',
      formData.nama_murid || '',
      formData.jenis_kelamin || 'L',
      formData.kelas || '',
      formData.nama_ekstra || '',
      formData.nama_guru || formData.guru_pembina || ''
    ]);
    return { success: true, message: 'Data ekstra berhasil ditambahkan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateDataMuridEkstra(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_EKSTRA);
    const data = getSheetData(SHEET_NAMES.DATA_MURID_EKSTRA);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Pastikan header nama_guru ada di baris 1
    let lastCol = Math.max(sheet.getLastColumn(), 6);
    let headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    if (!headerVals.map(h => h.toLowerCase()).includes('nama_guru')) {
      sheet.getRange(1, lastCol + 1).setValue('nama_guru').setFontWeight('bold');
      lastCol++;
      headerVals = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => String(h).trim());
    }

    const values = headerVals.map(h => formData[h] !== undefined ? formData[h] : (row[h] || ''));
    sheet.getRange(row._rowIndex, 1, 1, values.length).setValues([values]);
    return { success: true, message: 'Data ekstra berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteDataMuridEkstra(id) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_MURID_EKSTRA);
    const data = getSheetData(SHEET_NAMES.DATA_MURID_EKSTRA);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Data ekstra berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === FORM PRESENSI / ABSEN ===
function getMuridByKelas(kelas) {
  const data = getSheetData(SHEET_NAMES.DATA_MURID);
  return data.filter(r => r.kelas === kelas);
}

function saveAbsensi(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.HASIL_ABSEN);
    const settings = getSettings();
    const students = JSON.parse(formData.students);
    const now = new Date();
    const createdAt = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const ta = settings.tahun_ajaran || '';
    const semester = settings.semester || '';

    // Hapus presensi lama jika pada tanggal, mapel, kelas, tahun ajaran, dan semester yang sama (replace/update)
    const existing = getSheetData(SHEET_NAMES.HASIL_ABSEN);
    const rowsToDelete = [];
    existing.forEach(r => {
      if (r.tanggal === formData.tanggal &&
          r.kelas === formData.kelas &&
          r.mata_pelajaran === formData.mata_pelajaran &&
          r.tahun_ajaran === ta &&
          r.semester === semester) {
        rowsToDelete.push(r._rowIndex);
      }
    });

    // Delete from bottom to top to avoid row shift
    rowsToDelete.sort((a, b) => b - a).forEach(rowIdx => {
      sheet.deleteRow(rowIdx);
    });

    students.forEach(s => {
      const newId = getNextId(SHEET_NAMES.HASIL_ABSEN);
      sheet.appendRow([
        newId,
        formData.tanggal,
        ta,
        semester,
        s.nisn || '',
        s.nama_murid || '',
        s.jenis_kelamin || '',
        formData.kelas || '',
        s.keterangan || 'H',
        formData.mata_pelajaran || '',
        formData.nama_guru || '',
        createdAt
      ]);
    });
    
    return { success: true, message: `Presensi ${students.length} siswa berhasil disimpan!` };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === FORM JURNAL MENGAJAR ===
function getPertemuanKe(namaGuru, mapel, kelas) {
  try {
    const data = getSheetData(SHEET_NAMES.HASIL_JURNAL);
    const filtered = data.filter(r => 
      r.nama_guru === namaGuru && 
      r.mata_pelajaran === mapel && 
      r.kelas === kelas
    );
    return filtered.length + 1;
  } catch(e) {
    return 1;
  }
}

function saveJurnal(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.HASIL_JURNAL);
    const settings = getSettings();
    const newId = getNextId(SHEET_NAMES.HASIL_JURNAL);
    const now = new Date();
    const createdAt = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    sheet.appendRow([
      newId,
      formData.tanggal,
      settings.tahun_ajaran || '',
      settings.semester || '',
      formData.nama_guru || '',
      formData.mata_pelajaran || '',
      formData.jam_ke || '',
      formData.kelas || '',
      formData.pertemuan_ke || 1,
      formData.model_pembelajaran || '',
      formData.materi_pembelajaran || '',
      formData.murid_tidak_hadir || '',
      formData.ketuntasan_materi || 'tuntas',
      formData.keterangan_tuntas || '',
      formData.link_bukti_jurnal || '',
      createdAt
    ]);
    return { success: true, message: 'Jurnal mengajar berhasil disimpan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === FORM BIMBINGAN GURU WALI ===
function saveBimbinganGuruWali(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.HASIL_GURU_WALI);
    const settings = getSettings();
    const newId = getNextId(SHEET_NAMES.HASIL_GURU_WALI);
    const now = new Date();
    const createdAt = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    sheet.appendRow([
      newId,
      formData.tanggal,
      settings.tahun_ajaran || '',
      settings.semester || '',
      formData.nama_guru_wali || '',
      formData.nama_murid || '',
      formData.kategori || 'Individu',
      formData.topik_masalah || '',
      formData.tindak_lanjut || '',
      formData.keterangan || '',
      formData.file_bukti || '',
      createdAt
    ]);
    return { success: true, message: 'Bimbingan guru wali berhasil disimpan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === FORM KEGIATAN WALI KELAS ===
function saveKegiatanWali(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.HASIL_WALI);
    const settings = getSettings();
    const newId = getNextId(SHEET_NAMES.HASIL_WALI);
    const now = new Date();
    const createdAt = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    sheet.appendRow([
      newId,
      formData.tanggal,
      settings.tahun_ajaran || '',
      settings.semester || '',
      formData.kelas || '',
      formData.nama_wali_kelas || '',
      formData.deskripsi_kegiatan || '',
      formData.link_bukti_wali || '',
      createdAt
    ]);
    return { success: true, message: 'Kegiatan wali kelas berhasil disimpan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === FORM KEGIATAN EKSTRA ===
function saveKegiatanEkstra(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.HASIL_EKSTRA);
    const settings = getSettings();
    const newId = getNextId(SHEET_NAMES.HASIL_EKSTRA);
    const now = new Date();
    const createdAt = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    sheet.appendRow([
      newId,
      formData.tanggal,
      settings.tahun_ajaran || '',
      settings.semester || '',
      formData.nama_murid || '',
      formData.kegiatan_ekstra || '',
      formData.keterangan || '',
      formData.link_bukti_ekstra || '',
      formData.pembina_ekstra || '',
      createdAt
    ]);
    return { success: true, message: 'Kegiatan ekstra berhasil disimpan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === LAPORAN FUNCTIONS (Robust Trimmed Filters) ===
function getLaporanAbsen(filters) {
  let data = getSheetData(SHEET_NAMES.HASIL_ABSEN);
  if (filters) {
    if (filters.tahun_ajaran) data = data.filter(r => String(r.tahun_ajaran || '').trim() === String(filters.tahun_ajaran).trim());
    if (filters.semester) data = data.filter(r => String(r.semester || '').trim().toLowerCase() === String(filters.semester).trim().toLowerCase());
    if (filters.kelas) data = data.filter(r => String(r.kelas || '').trim() === String(filters.kelas).trim());
    if (filters.mata_pelajaran) data = data.filter(r => String(r.mata_pelajaran || '').trim() === String(filters.mata_pelajaran).trim());
    if (filters.nama_guru) data = data.filter(r => String(r.nama_guru || '').trim() === String(filters.nama_guru).trim());
    if (filters.nama_murid) data = data.filter(r => String(r.nama_murid || '').toLowerCase().includes(String(filters.nama_murid).toLowerCase().trim()));
  }
  return data;
}

function getLaporanJurnal(filters) {
  let data = getSheetData(SHEET_NAMES.HASIL_JURNAL);
  if (filters) {
    if (filters.tahun_ajaran) data = data.filter(r => String(r.tahun_ajaran || '').trim() === String(filters.tahun_ajaran).trim());
    if (filters.semester) data = data.filter(r => String(r.semester || '').trim().toLowerCase() === String(filters.semester).trim().toLowerCase());
    if (filters.kelas) data = data.filter(r => String(r.kelas || '').trim() === String(filters.kelas).trim());
    if (filters.mata_pelajaran) data = data.filter(r => String(r.mata_pelajaran || '').trim() === String(filters.mata_pelajaran).trim());
    if (filters.nama_guru) data = data.filter(r => String(r.nama_guru || '').trim() === String(filters.nama_guru).trim());
  }
  return data;
}

function getLaporanGuruWali(filters) {
  let data = getSheetData(SHEET_NAMES.HASIL_GURU_WALI);
  if (filters) {
    if (filters.tahun_ajaran) data = data.filter(r => String(r.tahun_ajaran || '').trim() === String(filters.tahun_ajaran).trim());
    if (filters.semester) data = data.filter(r => String(r.semester || '').trim().toLowerCase() === String(filters.semester).trim().toLowerCase());
    if (filters.nama_guru_wali) data = data.filter(r => String(r.nama_guru_wali || '').trim() === String(filters.nama_guru_wali).trim());
  }
  return data;
}

function getLaporanWali(filters) {
  let data = getSheetData(SHEET_NAMES.HASIL_WALI);
  if (filters) {
    if (filters.tahun_ajaran) data = data.filter(r => String(r.tahun_ajaran || '').trim() === String(filters.tahun_ajaran).trim());
    if (filters.semester) data = data.filter(r => String(r.semester || '').trim().toLowerCase() === String(filters.semester).trim().toLowerCase());
    if (filters.kelas) data = data.filter(r => String(r.kelas || '').trim() === String(filters.kelas).trim());
    if (filters.nama_wali_kelas) data = data.filter(r => String(r.nama_wali_kelas || '').trim() === String(filters.nama_wali_kelas).trim());
  }
  return data;
}

function getLaporanEkstra(filters) {
  let data = getSheetData(SHEET_NAMES.HASIL_EKSTRA);
  if (filters) {
    if (filters.tahun_ajaran) data = data.filter(r => String(r.tahun_ajaran || '').trim() === String(filters.tahun_ajaran).trim());
    if (filters.semester) data = data.filter(r => String(r.semester || '').trim().toLowerCase() === String(filters.semester).trim().toLowerCase());
    if (filters.kegiatan_ekstra) data = data.filter(r => String(r.kegiatan_ekstra || '').trim() === String(filters.kegiatan_ekstra).trim());
    if (filters.pembina_ekstra) data = data.filter(r => String(r.pembina_ekstra || '').trim() === String(filters.pembina_ekstra).trim());
  }
  return data;
}

// Endpoint bundle laporan lengkap (Options + Data Sekaligus dalam 1 Roundtrip)
function getLaporanFullBundle(laporanType, filters) {
  try {
    const settings = getSettings();
    const taList = getDaftarTahunAjaran();
    const kelasList = getDaftarKelas();
    const mapelList = getDaftarMapel();
    const ekstraList = getDaftarEkstra();
    const guru = getSheetData(SHEET_NAMES.DATA_GURU);
    const guruNamaList = guru.map(g => ({ nama: g.nama_guru, nip: g.nip }));

    let reportData = [];
    let bimbinganMurid = [];
    if (laporanType === 'absen') reportData = getLaporanAbsen(filters);
    else if (laporanType === 'jurnal') reportData = getLaporanJurnal(filters);
    else if (laporanType === 'guruwali') {
      reportData = getLaporanGuruWali(filters);
      bimbinganMurid = getDataMuridGuruWali();
    }
    else if (laporanType === 'wali') reportData = getLaporanWali(filters);
    else if (laporanType === 'ekstra') reportData = getLaporanEkstra(filters);

    return {
      success: true,
      settings: settings,
      tahunAjaran: taList,
      kelas: kelasList,
      mapel: mapelList,
      ekstra: ekstraList,
      guruList: guruNamaList,
      bimbinganMurid: bimbinganMurid,
      data: reportData
    };
  } catch(e) {
    return {
      success: false,
      message: e.message,
      settings: {},
      tahunAjaran: [],
      kelas: [],
      mapel: [],
      ekstra: [],
      guruList: [],
      data: []
    };
  }
}

// === UPDATE & DELETE LAPORAN ===
function updateLaporan(sheetName, formData) {
  try {
    const sheet = getSheet(sheetName);
    const data = getSheetData(sheetName);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Otomatis hapus file lama di Google Drive jika file lampiran diganti atau dihapus
    const fileCols = SHEET_FILE_COLUMNS[sheetName] || [];
    fileCols.forEach(col => {
      if (formData[col] !== undefined && row[col]) {
        syncDriveFileReplacement(row[col], formData[col]);
      }
    });

    const headers = getHeaders(sheetName);
    const values = headers.map(h => {
      if (h === 'created_at') return row[h] || '';
      return formData[h] !== undefined ? formData[h] : (row[h] || '');
    });
    
    sheet.getRange(row._rowIndex, 1, 1, values.length).setValues([values]);
    return { success: true, message: 'Data berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteLaporan(sheetName, id) {
  try {
    const sheet = getSheet(sheetName);
    const data = getSheetData(sheetName);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Otomatis hapus file lampiran di Google Drive jika ada
    const fileCols = SHEET_FILE_COLUMNS[sheetName] || [];
    fileCols.forEach(col => {
      if (row[col]) {
        deleteDriveFiles(row[col]);
      }
    });

    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Data berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === USER MANAGEMENT - CRUD ===
function getDataUser() {
  return getSheetData(SHEET_NAMES.DATA_USER);
}

function addDataUser(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_USER);
    const users = getSheetData(SHEET_NAMES.DATA_USER);
    
    // Cek duplikat username
    if (users.find(u => String(u.username).toLowerCase() === String(formData.username).toLowerCase())) {
      return { success: false, message: 'Username sudah digunakan!' };
    }
    
    const newId = getNextId(SHEET_NAMES.DATA_USER);
    sheet.appendRow([
      newId,
      formData.username || '',
      formData.password || '',
      formData.hak_akses || 'Guru',
      formData.nama || '',
      formData.nip || ''
    ]);
    return { success: true, message: 'Akun pengguna berhasil ditambahkan!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function updateDataUser(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_USER);
    const data = getSheetData(SHEET_NAMES.DATA_USER);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Proteksi akun SAdmin
    if (String(row.username).toLowerCase() === 'sadmin') {
      formData.username = 'SAdmin';
      formData.hak_akses = 'Super Admin';
    }
    
    sheet.getRange(row._rowIndex, 1, 1, 6).setValues([[
      formData.id,
      formData.username || row.username,
      formData.password || row.password,
      formData.hak_akses || row.hak_akses,
      formData.nama || row.nama,
      formData.nip || row.nip
    ]]);
    return { success: true, message: 'Data pengguna berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

function deleteDataUser(id) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_USER);
    const data = getSheetData(SHEET_NAMES.DATA_USER);
    const row = data.find(r => r.id == id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    // Proteksi: tidak boleh hapus akun induk SAdmin atau akun resmi Pelihat (viewer)
    const uname = String(row.username || '').toLowerCase().trim();
    const role = String(row.hak_akses || '').toLowerCase().trim();
    if (uname === 'sadmin' || uname === 'viewer' || role.includes('super admin') || role === 'pelihat') {
      return { success: false, message: 'Akun Super Admin dan Pelihat dilindungi dan tidak dapat dihapus!' };
    }
    
    sheet.deleteRow(row._rowIndex);
    return { success: true, message: 'Akun pengguna berhasil dihapus!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === PROFIL ===
function updateProfil(formData) {
  try {
    const sheet = getSheet(SHEET_NAMES.DATA_USER);
    const data = getSheetData(SHEET_NAMES.DATA_USER);
    const row = data.find(r => r.id == formData.id);
    if (!row) return { success: false, message: 'Data tidak ditemukan!' };
    
    if (formData.nama) sheet.getRange(row._rowIndex, 5).setValue(formData.nama);
    if (formData.nip) sheet.getRange(row._rowIndex, 6).setValue(formData.nip);
    if (formData.password_baru) sheet.getRange(row._rowIndex, 3).setValue(formData.password_baru);
    
    return { success: true, message: 'Profil berhasil diperbarui!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === TOMBOL SAKTI: HAPUS DATA ===
function hapusSemuaData() {
  try {
    // 1. Bersihkan seluruh file lampiran di Google Drive sebelum menghapus baris data
    const sheetsWithFiles = [
      { name: SHEET_NAMES.HASIL_JURNAL, cols: ['link_bukti_jurnal', 'link_bukti', 'file_bukti'] },
      { name: SHEET_NAMES.HASIL_GURU_WALI, cols: ['file_bukti', 'link_bukti'] },
      { name: SHEET_NAMES.HASIL_WALI, cols: ['link_bukti_wali', 'link_bukti', 'file_bukti'] },
      { name: SHEET_NAMES.HASIL_EKSTRA, cols: ['link_bukti_ekstra', 'link_bukti', 'file_bukti'] },
      { name: SHEET_NAMES.DATA_MURID_GURU_WALI, cols: ['foto_murid'] },
      { name: SHEET_NAMES.DATA_MURID, cols: ['foto_siswa', 'foto_murid', 'foto'] }
    ];

    sheetsWithFiles.forEach(item => {
      try {
        const rows = getSheetData(item.name);
        rows.forEach(r => {
          item.cols.forEach(col => {
            if (r[col]) {
              deleteDriveFiles(r[col]);
            }
          });
        });
      } catch(errFile) {
        Logger.log('Gagal hapus file drive massal untuk ' + item.name + ': ' + errFile.message);
      }
    });

    // 2. Bersihkan file custom logo/kop/ttd di Pengaturan jika bukan file default template yang dilindungi
    try {
      const currentSettings = getSettings();
      const defaultSettings = getDefaultSettingsObject();
      ['logo', 'kop_surat', 'ttd_kepsek'].forEach(field => {
        if (currentSettings[field] && currentSettings[field] !== defaultSettings[field]) {
          deleteDriveFiles(currentSettings[field]);
        }
      });
    } catch(errSetFile) {
      Logger.log('Gagal bersihkan file custom pengaturan: ' + errSetFile.message);
    }

    // 3. Hapus semua baris data transaksi
    const transactionSheets = [
      SHEET_NAMES.HASIL_ABSEN,
      SHEET_NAMES.HASIL_JURNAL,
      SHEET_NAMES.HASIL_GURU_WALI,
      SHEET_NAMES.HASIL_WALI,
      SHEET_NAMES.HASIL_EKSTRA
    ];
    
    transactionSheets.forEach(name => {
      const sheet = getSheet(name);
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
    });
    
    // 4. Hapus master data
    const masterSheets = [
      SHEET_NAMES.DATA_GURU,
      SHEET_NAMES.DATA_MURID,
      SHEET_NAMES.DATA_MURID_GURU_WALI,
      SHEET_NAMES.DATA_MURID_EKSTRA
    ];
    
    masterSheets.forEach(name => {
      const sheet = getSheet(name);
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
    });
    
    // 5. Hapus user di Manajemen User & Hak Akses (RBAC) KECUALI hak akses Super Admin dan Pelihat
    const userSheet = getSheet(SHEET_NAMES.DATA_USER);
    const users = getSheetData(SHEET_NAMES.DATA_USER);
    const rowsToDelete = [];
    
    users.forEach(u => {
      const uname = String(u.username || '').trim().toLowerCase();
      const role = String(u.hak_akses || '').trim().toLowerCase();
      const isSuperAdmin = uname === 'sadmin' || role === 'super admin' || role.includes('super admin');
      const isViewer = uname === 'viewer' || role === 'pelihat' || role.includes('pelihat');
      
      // Khusus hak akses Super Admin dan Pelihat TIDAK DIHAPUS
      if (!isSuperAdmin && !isViewer) {
        rowsToDelete.push(u._rowIndex);
      }
    });
    
    // Delete from bottom to top to avoid row shift issues
    rowsToDelete.sort((a, b) => b - a).forEach(rowIdx => {
      userSheet.deleteRow(rowIdx);
    });

    // Pastikan jika akun SAdmin atau viewer belum ada, tambahkan kembali
    const remainingUsers = getSheetData(SHEET_NAMES.DATA_USER);
    const hasSAdmin = remainingUsers.some(u => String(u.username || '').toLowerCase() === 'sadmin' || String(u.hak_akses || '').toLowerCase().includes('super admin'));
    const hasViewer = remainingUsers.some(u => String(u.username || '').toLowerCase() === 'viewer' || String(u.hak_akses || '').toLowerCase().includes('pelihat'));
    if (!hasSAdmin) {
      userSheet.appendRow([1, 'SAdmin', 'Pengelola@Admin@Super', 'Super Admin', 'Admin Pengelola', '-']);
    }
    if (!hasViewer) {
      userSheet.appendRow([2, 'viewer', 'view123', 'Pelihat', 'Pengawas Sekolah', '197509121999031002']);
    }

    // 6. Simpan kembali data default di database Pengaturan
    // (Identitas Sekolah & Periode Akademik, Kop Surat & Tanda Tangan Digital, dan Folder Penyimpanan Google Drive)
    const settingsSheet = getSheet(SHEET_NAMES.PENGATURAN);
    const headersPengaturan = getHeaders(SHEET_NAMES.PENGATURAN);
    const defaultSettings = getDefaultSettingsObject();

    if (settingsSheet.getLastRow() > 1) {
      settingsSheet.deleteRows(2, settingsSheet.getLastRow() - 1);
    }
    const defaultRowValues = headersPengaturan.map(h => defaultSettings[h] !== undefined ? defaultSettings[h] : '');
    defaultRowValues[0] = 1;
    settingsSheet.appendRow(defaultRowValues);
    
    return { 
      success: true, 
      message: 'Pembersihan database selesai! Seluruh data transaksi, master, serta file foto & dokumen terkait di Google Drive telah dihapus. Data Pengaturan (Identitas Sekolah, Kop Surat, TTD, & Folder Drive) telah dipulihkan ke data default. Akun Super Admin dan Pelihat tetap aman.' 
    };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === EXPORT DATA ===
function exportToExcel(sheetName) {
  try {
    const data = getSheetData(sheetName);
    return { success: true, data: data };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === IMPORT DATA ===
function importData(sheetName, rows, mode) {
  try {
    const sheet = getSheet(sheetName);
    const headers = getHeaders(sheetName);
    
    if (mode === 'replace') {
      // Hapus semua data lama
      if (sheet.getLastRow() > 1) {
        sheet.deleteRows(2, sheet.getLastRow() - 1);
      }
    }
    
    // Tambahkan data baru
    rows.forEach(row => {
      const newId = getNextId(sheetName);
      const values = headers.map((h, idx) => {
        if (h === 'id') return newId;
        return row[h] || row[idx] || '';
      });
      sheet.appendRow(values);
    });
    
    return { success: true, message: `${rows.length} data berhasil diimpor!` };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === HELPER: Daftar Options ===
function getDaftarKelas() {
  const settings = getSettings();
  const kelasList = String(settings.kelas || '').split(',').map(s => s.trim()).filter(Boolean);
  
  // Tambahkan kelas dari data murid
  const murid = getSheetData(SHEET_NAMES.DATA_MURID);
  murid.forEach(m => {
    if (m.kelas && !kelasList.includes(m.kelas)) {
      kelasList.push(m.kelas);
    }
  });
  
  return [...new Set(kelasList)].sort();
}

function getDaftarMapel() {
  const settings = getSettings();
  let mapelStr = String(settings.mata_pelajaran || '');
  
  // Parse JSON or comma-separated
  let mapelList;
  try {
    mapelList = JSON.parse(mapelStr);
  } catch(e) {
    mapelList = mapelStr.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  return [...new Set(mapelList)].sort();
}

function getDaftarEkstra() {
  const settings = getSettings();
  let ekstraStr = String(settings.list_ekstrakurikuler || '');
  
  let ekstraList;
  try {
    ekstraList = JSON.parse(ekstraStr);
  } catch(e) {
    ekstraList = ekstraStr.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  return [...new Set(ekstraList)].sort();
}

function getDaftarTahunAjaran() {
  const settings = getSettings();
  let taStr = String(settings.list_tahun_ajaran || '');
  
  let taList;
  try {
    taList = JSON.parse(taStr);
  } catch(e) {
    taList = [settings.tahun_ajaran || '2026/2027'];
  }
  
  if (!taList.includes(settings.tahun_ajaran) && settings.tahun_ajaran) {
    taList.push(settings.tahun_ajaran);
  }
  
  return [...new Set(taList)].sort();
}

function getDaftarGuruNama() {
  const guru = getSheetData(SHEET_NAMES.DATA_GURU);
  return guru.map(g => ({ nama: g.nama_guru, nip: g.nip, pembina_ekstra: g.pembina_ekstra }));
}

// === OTORISASI GOOGLE DRIVE ===
// Jalankan fungsi ini 1x di editor Google Apps Script untuk memberikan izin DriveApp
function authorizeDriveAccess() {
  try {
    const root = DriveApp.getRootFolder();
    Logger.log('Otorisasi DriveApp Berhasil! Folder Root: ' + root.getName());
    return { success: true, message: 'Otorisasi Google Drive berhasil! Akun telah memiliki akses Drive.' };
  } catch(e) {
    Logger.log('Error Otorisasi: ' + e.message);
    return { success: false, message: 'Error otorisasi: ' + e.message };
  }
}

// === FILE UPLOAD KE DRIVE ===
function uploadFileToDrive(fileData, fileName, folderId) {
  try {
    if (!fileData) {
      return { success: false, message: 'Data berkas kosong!' };
    }

    let folder;
    if (folderId && folderId !== 'root') {
      try {
        folder = DriveApp.getFolderById(folderId);
      } catch (errF) {
        // Jika folderId tidak valid atau tidak ditemukan, fallback ke root folder agar upload tidak gagal
        folder = DriveApp.getRootFolder();
      }
    } else {
      folder = DriveApp.getRootFolder();
    }

    // Tentukan mime type sesuai ekstensi
    let mimeType = MimeType.JPEG;
    const lowerName = String(fileName || '').toLowerCase();
    if (lowerName.endsWith('.png')) mimeType = MimeType.PNG;
    else if (lowerName.endsWith('.pdf')) mimeType = MimeType.PDF;
    else if (lowerName.endsWith('.gif')) mimeType = MimeType.GIF;
    else if (lowerName.endsWith('.webp')) mimeType = 'image/webp';

    const decoded = Utilities.base64Decode(fileData);
    const blob = Utilities.newBlob(decoded, mimeType, fileName || ('upload_' + new Date().getTime()));
    const file = folder.createFile(blob);

    // Set permission agar thumbnail/file dapat dibuka
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(errShare) {
      // Abaikan jika kebijakan domain membatasi sharing publik
    }

    const fileId = file.getId();
    const thumbnailUrl = 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1000';
    const viewUrl = file.getUrl();

    return {
      success: true, 
      url: thumbnailUrl,
      fileId: fileId,
      viewUrl: viewUrl
    };
  } catch(e) {
    return { success: false, message: 'Error upload: ' + e.message };
  }
}

// Fungsi untuk extract folder ID dari URL Drive
function extractFolderId(url) {
  if (!url) return null;
  const match = String(url).match(/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// === GOOGLE DRIVE FILE CLEANUP & AUTO-SYNC HELPER ===
const SHEET_FILE_COLUMNS = {
  'Data Murid Guru Wali': ['foto_murid'],
  'Hasil Jurnal': ['link_bukti_jurnal'],
  'Hasil Guru Wali': ['file_bukti'],
  'Hasil Wali': ['link_bukti_wali'],
  'Hasil Ekstra': ['link_bukti_ekstra'],
  'Pengaturan': ['logo', 'kop_surat', 'ttd_kepsek']
};

function extractDriveFileId(str) {
  if (!str) return null;
  const s = String(str).trim();
  if (s.includes('/folders/')) return null; // Abaikan link folder
  
  let m = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  
  m = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return m[1];

  m = s.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];

  if (/^[a-zA-Z0-9_-]{25,}$/.test(s)) return s;
  return null;
}

// Berkas Drive bawaan yang tidak boleh dihapus saat pembersihan massal
const PROTECTED_DRIVE_IDS = [
  '1GUfUommgYjV-cnhU0tTB8kRJy8iXagkI',
  '1Z80pVGJv9v-GFwjE1_kBi_G9uRlR2gN7'
];

function deleteDriveFiles(urlOrUrls) {
  if (!urlOrUrls) return;
  const items = String(urlOrUrls).split(/[,;\n\r]+/);
  items.forEach(item => {
    const fileId = extractDriveFileId(item);
    if (fileId) {
      if (PROTECTED_DRIVE_IDS.includes(fileId)) {
        Logger.log('File ID dilindungi template, lewati hapus: ' + fileId);
        return;
      }
      try {
        const file = DriveApp.getFileById(fileId);
        file.setTrashed(true); // Memindahkan file ke trash Google Drive (otomatis hilang dari folder)
        Logger.log('File Drive berhasil dihapus dari folder: ' + fileId);
      } catch(e) {
        Logger.log('Lewati hapus file Drive ' + fileId + ': ' + e.message);
      }
    }
  });
}

function syncDriveFileReplacement(oldUrl, newUrl) {
  if (!oldUrl) return;
  const oldId = extractDriveFileId(oldUrl);
  const newId = extractDriveFileId(newUrl);
  // Jika file diganti dengan file baru atau dikosongkan, hapus file lama di Google Drive
  if (oldId && oldId !== newId) {
    deleteDriveFiles(oldUrl);
  }
}

// === PRINT LAPORAN DATA ===
function getPrintData(type, filters) {
  const settings = getSettings();
  let data = [];
  
  switch(type) {
    case 'absen':
      data = getLaporanAbsen(filters);
      break;
    case 'jurnal':
      data = getLaporanJurnal(filters);
      break;
    case 'guruwali':
      data = getLaporanGuruWali(filters);
      break;
    case 'wali':
      data = getLaporanWali(filters);
      break;
    case 'ekstra':
      data = getLaporanEkstra(filters);
      break;
  }
  
  return { settings, data, guruList: getSheetData(SHEET_NAMES.DATA_GURU) };
}

// === INISIALISASI DATA DEFAULT ===
function initializeDefaultData() {
  try {
    // Cek apakah sudah ada data user
    const users = getSheetData(SHEET_NAMES.DATA_USER);
    if (users.length === 0) {
      const sheet = getSheet(SHEET_NAMES.DATA_USER);
      // Tambah akun SAdmin default
      sheet.appendRow([1, 'SAdmin', 'Pengelola@Admin@Super', 'Super Admin', 'Admin Pengelola', '-']);
      sheet.appendRow([2, 'viewer', 'view123', 'Pelihat', 'Pengawas Sekolah', '197509121999031002']);
    }
    
    // Cek apakah sudah ada pengaturan
    const settings = getSheetData(SHEET_NAMES.PENGATURAN);
    if (settings.length === 0) {
      const settingsSheet = getSheet(SHEET_NAMES.PENGATURAN);
      const defaultSettings = getSettings();
      const headers = getHeaders(SHEET_NAMES.PENGATURAN);
      const values = headers.map(h => defaultSettings[h] || '');
      settingsSheet.appendRow(values);
    }
    
    return { success: true, message: 'Inisialisasi berhasil!' };
  } catch(e) {
    return { success: false, message: 'Error: ' + e.message };
  }
}

// === HRBAC HELPER (Client-Side Check) ===
function checkAccess(module, hakAkses) {
  if (hakAkses === 'Super Admin' || hakAkses === 'admin') return true;
  
  if (hakAkses === 'Pelihat') {
    return module.startsWith('laporan');
  }
  
  const roles = hakAkses.split(',').map(r => r.trim());
  
  switch(module) {
    case 'master_guru':
    case 'master_murid':
      return false;
    case 'master_bimbingan':
      return roles.includes('Guru Wali');
    case 'master_ekstra':
      return roles.includes('Pembina Ekstra');
    case 'form_absen':
      return roles.includes('Guru') || roles.includes('Wali Kelas');
    case 'form_jurnal':
      return roles.includes('Guru');
    case 'form_guruwali':
      return roles.includes('Guru Wali') || roles.includes('Guru');
    case 'form_wali':
      return roles.includes('Wali Kelas');
    case 'form_ekstra':
      return roles.includes('Pembina Ekstra') || roles.includes('Guru');
    case 'laporan':
      return true;
    case 'pengaturan':
    case 'user_management':
      return false;
    default:
      return false;
  }
}
