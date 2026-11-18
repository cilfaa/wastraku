// ============================================================
// regionController.js — "koki" untuk data provinsi
// Sama seperti motifController, memakai pabrik createResourceController.
// ============================================================
import { RegionModel } from "../models/regionModel.js";
import { createResourceController } from "../utils/createResourceController.js";

// Parameter ke-2 = pesan yang dikirim kalau provinsi tidak ditemukan
export const RegionController = createResourceController(RegionModel, "Daerah tidak ditemukan");
