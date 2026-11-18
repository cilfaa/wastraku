// ============================================================
// regionRoutes.js — "papan alamat" untuk data provinsi
// Semua alamat di sini otomatis diawali /api/regions (lihat index.js)
// Provinsi hanya bisa dibaca (GET), tidak ada tambah/ubah/hapus.
// ============================================================
import express from "express";
import { RegionController } from "../controllers/regionController.js";

const router = express.Router();

router.get("/", RegionController.getAll);      // GET /api/regions      -> ambil semua provinsi
router.get("/:id", RegionController.getById);  // GET /api/regions/:id  -> ambil 1 provinsi

export default router;
