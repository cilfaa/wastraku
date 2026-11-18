# WastraKu — Katalog Batik Nusantara & Filosofi Motif (PWA)

Tugas Akhir Praktikum PPB 2026. Platform: **PWA (React + Vite)**. API: **Node.js + Express + Supabase** (sesuai Modul 1).

Isi project:
- `wastraku-api/` → server REST API + database (Express + Supabase)
- `wastraku-app/` → aplikasi PWA yang dilihat pengguna (React + Vite)

## Memenuhi aturan TA
| Aturan | Di WastraKu |
|---|---|
| API buatan sendiri (Modul 1) | `wastraku-api` (Express + Supabase) |
| Bottom Navigation Bar | `src/components/BottomNav.jsx` |
| Minimal 5 halaman | 6: Beranda, Motif Batik, Detail Motif, 38 Provinsi, Detail Provinsi, Profil |
| 2 halaman list + detail | Motif → Detail Motif, Provinsi → Detail Provinsi |
| Halaman Profile/About | `src/pages/About.jsx` (profil pembuat + CRUD motif) |
| GitHub | Repository ini |
| PWA wajib hosting gratis | Vercel |

## Endpoint API
| Method | URL | Fungsi |
|---|---|---|
| GET | `/api/motifs` | Daftar motif |
| GET | `/api/motifs/:id` | Detail motif |
| POST | `/api/motifs` | Tambah motif |
| PUT | `/api/motifs/:id` | Ubah motif |
| DELETE | `/api/motifs/:id` | Hapus motif |
| GET | `/api/regions` | Daftar 38 provinsi |
| GET | `/api/regions/:id` | Detail provinsi |

## Menjalankan di komputer sendiri

### 1. Database (Supabase)
1. Buat project di https://supabase.com.
2. Buka **SQL Editor → New query**, salin seluruh isi `wastraku-api/database.sql`, lalu klik **RUN**.
3. Cek **Table Editor**: harus ada tabel `regions` (38 baris) dan `motifs`.
4. Salin **Project URL** dan **anon public key** dari pengaturan project.

### 2. API
Di folder `wastraku-api`:
```bash
copy .env.example .env      # Mac/Linux: cp .env.example .env
```
Isi `SUPABASE_URL` dan `SUPABASE_KEY` di file `.env`, lalu:
```bash
npm install
npm run dev
```
Jika muncul `Server running on port 3000`, buka http://localhost:3000/api/motifs.

### 3. Aplikasi
Di folder `wastraku-app` (terminal baru):
```bash
copy .env.example .env
npm install
npm run dev
```
Buka alamat yang muncul (biasanya http://localhost:5173).

## Deploy ke Vercel (gratis)
1. **Deploy API dulu**: New Project → pilih repo ini → **Root Directory: `wastraku-api`** → isi Environment Variables `SUPABASE_URL` dan `SUPABASE_KEY` → Deploy. Salin alamat hasilnya.
2. **Deploy aplikasi**: New Project → repo yang sama → **Root Directory: `wastraku-app`** → Framework **Vite** → Environment Variable `VITE_API_URL` = alamat API tadi (tanpa garis miring di akhir) → Deploy.
3. Buka alamat aplikasi di HP, lalu pilih "Tambahkan ke layar utama" untuk memasangnya sebagai PWA.

## Fitur utama
- 38 provinsi dengan motif batik khas, filosofi, sejarah, simbolisme, dan penggunaan adat.
- Pencarian dan filter (kategori, provinsi, pulau).
- CRUD motif batik di halaman Profil.
- PWA: bisa dipasang, dengan cache gambar (Workbox) dan query cache untuk data API.
