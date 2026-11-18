// ============================================================
// motifRoutes.js — "papan alamat" untuk data motif batik
// Menentukan: URL + metode HTTP mana -> fungsi controller mana.
// Semua alamat di sini otomatis diawali /api/motifs (lihat index.js)
// ============================================================
import express from "express";
import { MotifController } from "../controllers/motifController.js";

const router = express.Router();

router.get("/", MotifController.getAll);        // GET    /api/motifs      -> ambil semua motif
router.get("/:id", MotifController.getById);    // GET    /api/motifs/:id  -> ambil 1 motif
router.post("/", MotifController.create);       // POST   /api/motifs      -> tambah motif baru
router.put("/:id", MotifController.update);     // PUT    /api/motifs/:id  -> ubah motif
router.delete("/:id", MotifController.remove);  // DELETE /api/motifs/:id  -> hapus motif

export default router;
