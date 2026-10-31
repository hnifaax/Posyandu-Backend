# Backend Sistem Informasi Posyandu

REST API untuk membantu kader Posyandu mengelola data peserta ibu hamil dan balita. Proyek dibuat menggunakan Express.js dan PostgreSQL.

## 1. Studi Kasus

Pencatatan data kesehatan ibu dan anak dapat tersebar di KMS, Buku KIA, buku register, dan lembar kertas. Kondisi tersebut dapat menyulitkan kader saat mencari riwayat pemeriksaan dan menyusun rekap. Sistem ini dirancang untuk mengelola data peserta, riwayat pemeriksaan, jadwal Posyandu, dan data kader secara terstruktur.

### Kebutuhan fitur
- Mengelola akun dan profil kader.
- Mengelola data peserta ibu hamil dan balita.
- Mencatat riwayat pemeriksaan kesehatan.
- Mengelola jadwal kegiatan Posyandu.
- Menghubungkan peserta dengan jadwal kegiatan.
- Menyimpan jenis indikator dan hasil pemeriksaan.
- Mendukung pencarian dan rekap data sebagai dasar pengembangan selanjutnya.

## 2. Teknologi
- PostgreSQL
- Node.js
- Express.js
- node-postgres (`pg`)
- Postman

## 3. Struktur Database

Terdapat 8 tabel:
1. `users`
2. `kader_profiles`
3. `participants`
4. `posyandu_schedules`
5. `schedule_participants`
6. `examinations`
7. `examination_types`
8. `examination_results`

### Relasi
- **One-to-one:** `users` — `kader_profiles` (kolom `user_id` pada `kader_profiles` bersifat UNIQUE).
- **One-to-many:** `participants` — `examinations`.
- **Many-to-many:** `participants` — `posyandu_schedules`, melalui `schedule_participants`.
- **Many-to-many tambahan:** `examinations` — `examination_types`, melalui `examination_results`.

File SQL ada di `database/schema.sql`. File DBML ada di `database/posyandu.dbml` sebagai alternatif untuk membuat diagram di dbdiagram.io.

## 4. Persiapan Database
1. Buka pgAdmin atau psql.
2. Buat database bernama `posyandu_db`.
3. Jalankan seluruh isi `database/schema.sql` pada database tersebut.
4. (Opsional) Jalankan `database/seed.sql` untuk memasukkan data contoh.

Contoh menggunakan psql:
```bash
createdb -U postgres posyandu_db
psql -U postgres -d posyandu_db -f database/schema.sql
```

## 5. Menjalankan REST API
Pastikan Node.js dan PostgreSQL sudah terpasang dan PostgreSQL sedang berjalan.

```bash
npm install
```

Salin `.env.example` menjadi `.env`, kemudian sesuaikan konfigurasi PostgreSQL:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posyandu_db
DB_USER=postgres
DB_PASSWORD=password_postgresql_kamu
```

Jalankan server:
```bash
npm run dev
```
atau:
```bash
npm start
```

Jika berhasil, terminal menampilkan pesan koneksi PostgreSQL dan alamat `http://localhost:3000`.

## 6. Endpoint REST API

Base URL: `http://localhost:3000`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/participants` | Mendapatkan semua peserta |
| GET | `/api/participants/:id` | Mendapatkan peserta berdasarkan ID |
| POST | `/api/participants` | Menambahkan peserta |
| PUT | `/api/participants/:id` | Memperbarui peserta |
| DELETE | `/api/participants/:id` | Menghapus peserta |

GET semua peserta juga mendukung filter:
- `/api/participants?search=aisyah`
- `/api/participants?type=balita`
- `/api/participants?search=dewi&type=ibu_hamil`

### Contoh body POST
```json
{
  "full_name": "Aisyah Putri",
  "participant_type": "balita",
  "nik": "3501010101200001",
  "birth_date": "2023-05-12",
  "gender": "P",
  "address": "Desa Sukamaju",
  "phone": "081234567891",
  "guardian_name": "Rina",
  "notes": "Contoh data peserta"
}
```

`full_name` dan `participant_type` wajib diisi. `participant_type` hanya menerima `ibu_hamil` atau `balita`; `gender` menerima `L` atau `P`.

## 7. Pengujian Postman
1. Jalankan server dan pastikan database aktif.
2. Buka Postman, pilih **Import**, lalu pilih `postman/Posyandu-Backend.postman_collection.json`.
3. Jalankan request secara berurutan:
   - POST - Tambah Peserta
   - GET - Semua Peserta
   - GET - Peserta Berdasarkan ID
   - PUT - Update Peserta
   - DELETE - Hapus Peserta
4. Request POST otomatis menyimpan ID hasil pembuatan ke collection variable `participantId`, yang digunakan request berikutnya.
5. Ambil screenshot masing-masing response Postman untuk dimasukkan ke dokumen pengumpulan.

## 8. Membuat Diagram dbdiagram.io
1. Masuk ke https://dbdiagram.io dan buat diagram baru.
2. Buka `database/posyandu.dbml`.
3. Copy seluruh isinya ke editor dbdiagram.io.
4. Simpan diagram, pilih fitur Share, lalu atur akses agar dapat dilihat publik.
5. Salin link diagram publik untuk Form Pengumpulan.

Jika ingin mengikuti instruksi PDF secara literal, `database/schema.sql` juga dapat digunakan melalui fitur import SQL PostgreSQL.

## 9. GitHub
Buat repository publik, lalu push isi folder proyek. Jangan unggah `.env` atau `node_modules`. File `.gitignore` telah disediakan.

```bash
git init
git add .
git commit -m "Initial commit - Posyandu Backend API"
git branch -M main
git remote add origin https://github.com/USERNAME/posyandu-backend.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub milikmu.

## 10. Checklist Sebelum Pengumpulan
- [ ] Database PostgreSQL berhasil dibuat.
- [ ] Semua 8 tabel berhasil dibuat.
- [ ] Relasi 1:1, 1:M, dan M:M terlihat di diagram.
- [ ] Diagram dbdiagram.io sudah disimpan dan dibagikan secara publik.
- [ ] Server Express.js berhasil terhubung ke PostgreSQL.
- [ ] Lima endpoint berhasil diuji di Postman.
- [ ] Lima screenshot response Postman sudah disiapkan.
- [ ] `.gitignore` mengecualikan `node_modules` dan `.env`.
- [ ] Repository GitHub bersifat publik atau ZIP tidak memuat `node_modules` dan `.env`.
- [ ] Link diagram dan link repository dimasukkan ke Form Pengumpulan.

**Catatan:** Proyek ini merupakan starter project yang disiapkan untuk dijalankan dan diuji di komputer pengguna. Screenshot Postman dan link publik GitHub/dbdiagram harus dibuat setelah pengujian dan publikasi oleh pemilik akun.
