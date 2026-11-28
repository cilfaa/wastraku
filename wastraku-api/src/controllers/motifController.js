// ============================================================
// motifController.js — "koki" untuk data motif
// Selain CRUD dari createResourceController, juga menangani upload
// foto ke Supabase Storage agar database hanya menyimpan URL pendek.
// ============================================================
import crypto from "node:crypto";
import { supabase } from "../config/supabaseClient.js";
import { MotifModel } from "../models/motifModel.js";
import { createResourceController } from "../utils/createResourceController.js";

const BUCKET = "motif-images";
const baseController = createResourceController(MotifModel, "Motif tidak ditemukan");

export const MotifController = {
  ...baseController,

  // Mengunggah gambar ke Supabase Storage dan mengembalikan URL publiknya
  async uploadImage(req, res) {
    try {
      const { image } = req.body || {};
      if (!image || typeof image !== "string") {
        return res.status(400).json({ error: "Data gambar tidak ditemukan." });
      }

      const match = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) {
        return res.status(400).json({ error: "Format gambar harus berupa data URI valid." });
      }

      const contentType = match[1];
      const ext = contentType.includes("webp") ? "webp" : contentType.includes("png") ? "png" : "jpg";
      const fileName = `motifs/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const buffer = Buffer.from(match[2], "base64");

      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
        contentType,
        upsert: false,
      });

      if (uploadError) {
        return res.status(400).json({
          error: `Gagal upload ke Supabase Storage (${BUCKET}): ${uploadError.message}`,
        });
      }

      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      return res.status(201).json({ url: urlData.publicUrl });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
