// ============================================================
// motifModel.js — "tukang ambil barang" tabel `motifs` di Supabase
// Model adalah satu-satunya tempat yang bicara langsung ke database.
// ============================================================
import { supabase } from "../config/supabaseClient.js";

// Kolom yang diambil. `regions ( ... )` = ikut mengambil data provinsi
// asal motif (relasi lewat region_id), jadi tidak perlu query dua kali.
const COLUMNS = `
  id, name, category, occasion, philosophy, history, symbolism, description, image_url, region_id,
  regions ( id, name, province, characteristic )
`;

export const MotifModel = {
  // Ambil semua motif, diurutkan berdasarkan nama A-Z
  async getAll() {
    const { data, error } = await supabase.from("motifs").select(COLUMNS).order("name");
    if (error) throw error;
    return data;
  },

  // Ambil satu motif; maybeSingle() = hasilnya null (bukan error) kalau tidak ada
  async getById(id) {
    const { data, error } = await supabase.from("motifs").select(COLUMNS).eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },

  // Tambah motif baru (insert), lalu kembalikan data yang baru dibuat
  async create(payload) {
    const { data, error } = await supabase.from("motifs").insert([payload]).select(COLUMNS).single();
    if (error) throw error;
    return data;
  },

  // Ubah motif yang id-nya cocok (update ... where id = ...)
  async update(id, payload) {
    const { data, error } = await supabase.from("motifs").update(payload).eq("id", id).select(COLUMNS).maybeSingle();
    if (error) throw error;
    return data;
  },

  // Hapus motif yang id-nya cocok
  async remove(id) {
    const { data, error } = await supabase.from("motifs").delete().eq("id", id).select("id").maybeSingle();
    if (error) throw error;
    return data;
  },
};
