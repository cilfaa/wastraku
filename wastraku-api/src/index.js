// ============================================================
// index.js — pintu masuk server API (dijalankan pertama kali)
// Tugas: menyalakan server Express dan mendaftarkan alamat (route).
// ============================================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import motifRoutes from "./routes/motifRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";

// Baca file .env (isi PORT, SUPABASE_URL, dll)
dotenv.config();

const app = express();

// cors: mengizinkan website frontend (domain lain) memanggil API ini
app.use(cors());
// express.json: supaya server bisa membaca data JSON (limit 2mb untuk foto base64)
app.use(express.json({ limit: "2mb" }));

// Halaman cek: buka alamat utama untuk memastikan API hidup
app.get("/", (req, res) => {
  res.json({
    message: "WastraKu API berjalan",
    endpoints: ["/api/motifs", "/api/regions"],
  });
});

// Semua alamat yang berawalan /api/motifs diurus oleh motifRoutes
app.use("/api/motifs", motifRoutes);
// Semua alamat yang berawalan /api/regions diurus oleh regionRoutes
app.use("/api/regions", regionRoutes);

// Kalau alamat tidak cocok dengan apa pun di atas, balas 404 (tidak ditemukan)
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// Di Vercel server dijalankan otomatis, jadi app.listen hanya dipakai di laptop sendiri
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
