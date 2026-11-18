// ============================================================
// createResourceController.js — "pabrik koki"
// Membuat satu set fungsi (getAll, getById, create, update, remove)
// untuk model apa pun. Dipakai bersama oleh motif dan provinsi
// supaya kode tidak diulang (prinsip DRY = Don't Repeat Yourself).
// ============================================================

// Pola format ID yang valid (UUID), contoh: 9297e4c3-0a7d-4179-a2d7-8248e9356553
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// model           = objek yang bisa bicara ke database (motifModel / regionModel)
// notFoundMessage = pesan kalau data yang dicari tidak ada
export function createResourceController(model, notFoundMessage) {
  return {
    // READ (semua): ambil seluruh data
    async getAll(_req, res) {
      try {
        const data = await model.getAll()
        // Cache-Control: browser/CDN boleh menyimpan jawaban ini 5 menit agar lebih cepat
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
        res.json(data)
      } catch (err) {
        // 500 = server/database bermasalah
        res.status(500).json({ error: err.message })
      }
    },

    // READ (satu): ambil satu data berdasarkan id di URL
    async getById(req, res) {
      const { id } = req.params
      // Kalau id bukan format UUID, langsung bilang tidak ditemukan (404)
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.getById(id)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
        res.json(data)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    },

    // CREATE: tambah data baru dari isi form (req.body)
    async create(req, res) {
      try {
        const data = await model.create(req.body)
        // 201 = berhasil dibuat
        res.status(201).json(data)
      } catch (err) {
        // 400 = data yang dikirim salah/tidak lengkap
        res.status(400).json({ error: err.message })
      }
    },

    // UPDATE: ubah data yang sudah ada
    async update(req, res) {
      const { id } = req.params
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.update(id, req.body)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.json(data)
      } catch (err) {
        res.status(400).json({ error: err.message })
      }
    },

    // DELETE: hapus data berdasarkan id
    async remove(req, res) {
      const { id } = req.params
      if (!UUID_RE.test(id)) {
        return res.status(404).json({ error: notFoundMessage })
      }

      try {
        const data = await model.remove(id)
        if (!data) return res.status(404).json({ error: notFoundMessage })
        res.json({ deleted: true, id: data.id })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    },
  }
}
