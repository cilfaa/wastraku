// ============================================================
// motifModel.js — "tukang ambil barang" tabel `motifs` di Supabase
// Mendukung pagination (?page=1&limit=9) serta filter kategori,
// provinsi, dan pencarian teks langsung di query database.
// ============================================================
import { supabase } from "../config/supabaseClient.js";

const COLUMNS = `
  id, name, category, occasion, philosophy, history, symbolism, description, image_url, region_id,
  regions ( id, name, province, characteristic )
`;

export const MotifModel = {
  // Ambil motif; jika ada parameter page/limit, kembalikan format pagination
  async getAll(query = {}) {
    const page = Number.parseInt(query.page, 10);
    const limit = Number.parseInt(query.limit, 10);
    const hasPagination = Number.isFinite(page) && page > 0 && Number.isFinite(limit) && limit > 0;

    let req = supabase
      .from("motifs")
      .select(COLUMNS, hasPagination ? { count: "exact" } : undefined)
      .order("name");

    if (query.category && query.category !== "Semua") {
      req = req.eq("category", query.category);
    }

    if (query.province && query.province !== "Semua") {
      // Filter berdasarkan nama provinsi pada tabel relasi regions
      const { data: matchedRegions, error: regErr } = await supabase
        .from("regions")
        .select("id")
        .eq("province", query.province);
      if (regErr) throw regErr;
      const ids = (matchedRegions || []).map((r) => r.id);
      if (ids.length === 0) {
        return hasPagination ? { items: [], total: 0, page, limit, totalPages: 1 } : [];
      }
      req = req.in("region_id", ids);
    }

    if (query.q && String(query.q).trim()) {
      const term = String(query.q).trim().replace(/,/g, " ");
      req = req.or(
        `name.ilike.%${term}%,category.ilike.%${term}%,occasion.ilike.%${term}%,philosophy.ilike.%${term}%,description.ilike.%${term}%`,
      );
    }

    if (hasPagination) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      req = req.range(from, to);
      const { data, error, count } = await req;
      if (error) throw error;
      const total = count ?? (data ? data.length : 0);
      return {
        items: data || [],
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      };
    }

    const { data, error } = await req;
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

  // Ubah motif yang id-nya cocok
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
