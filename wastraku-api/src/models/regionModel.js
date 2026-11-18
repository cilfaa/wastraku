// ============================================================
// regionModel.js — "tukang ambil barang" tabel `regions` (38 provinsi)
// ============================================================
import { supabase } from "../config/supabaseClient.js";

// Kolom provinsi yang diambil dari database
const COLUMNS = "id, name, province, characteristic, description";

export const RegionModel = {
  // Ambil semua provinsi, diurutkan berdasarkan nama provinsi A-Z
  async getAll() {
    const { data, error } = await supabase.from("regions").select(COLUMNS).order("province");
    if (error) throw error;
    return data;
  },

  // Ambil satu provinsi berdasarkan id (null kalau tidak ada)
  async getById(id) {
    const { data, error } = await supabase.from("regions").select(COLUMNS).eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
};
