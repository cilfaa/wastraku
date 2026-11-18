// ============================================================
// motifController.js — "koki" untuk data motif
// Controller menerima permintaan, menyuruh model mengambil data,
// lalu membalas ke pengguna. Semua logikanya dibuat oleh pabrik
// createResourceController supaya tidak ditulis ulang di tiap file.
// ============================================================
import { MotifModel } from "../models/motifModel.js";
import { createResourceController } from "../utils/createResourceController.js";

// Parameter ke-2 = pesan yang dikirim kalau motif tidak ditemukan
export const MotifController = createResourceController(MotifModel, "Motif tidak ditemukan");
