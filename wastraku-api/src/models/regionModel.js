// ============================================================
// regionModel.js — "tukang ambil barang" tabel `regions` (38 provinsi)
// Mendukung pagination (?page=1&limit=12) dan filter pencarian/wilayah.
// ============================================================
import { supabase } from "../config/supabaseClient.js";

const COLUMNS = "id, name, province, characteristic, description";

export const RegionModel = {
  // Ambil semua provinsi; jika ada page/limit, kembalikan format pagination
  async getAll(query = {}) {
    const page = Number.parseInt(query.page, 10);
    const limit = Number.parseInt(query.limit, 10);
    const hasPagination = Number.isFinite(page) && page > 0 && Number.isFinite(limit) && limit > 0;

    let req = supabase
      .from("regions")
      .select(COLUMNS, hasPagination ? { count: "exact" } : undefined)
      .order("province");

    if (query.provinces) {
      const list = String(query.provinces)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (list.length > 0) req = req.in("province", list);
    }

    if (query.q && String(query.q).trim()) {
      const term = String(query.q).trim().replace(/,/g, " ");
      req = req.or(`province.ilike.%${term}%,name.ilike.%${term}%,characteristic.ilike.%${term}%`);
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

  // Ambil satu provinsi berdasarkan id (null kalau tidak ada)
  async getById(id) {
    const { data, error } = await supabase.from("regions").select(COLUMNS).eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  },
};
