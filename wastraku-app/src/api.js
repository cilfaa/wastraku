// ============================================================
// api.js — "kurir" yang mengambil/mengirim data ke API (backend)
// Semua halaman memanggil fungsi dari file ini, bukan fetch langsung.
// Fitur utama: QUERY CACHING — jawaban API disimpan sementara agar
// pindah halaman terasa instan dan tidak membebani server.
// ============================================================

// Alamat API. Diambil dari variabel VITE_API_URL (file .env / Vercel),
// kalau tidak ada dipakai alamat laptop sendiri. replace(...) membuang "/" di akhir.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')
const STORAGE_PREFIX = 'wastraku_qcache_v1:' // awalan nama kunci di sessionStorage
const TTL_MS = 1000 * 60 * 15 // masa berlaku cache: 15 menit

// Cache lapis 1: di memori (paling cepat, hilang saat halaman di-refresh)
const cache = new Map()
// Permintaan yang sedang berjalan. Mencegah memanggil alamat yang sama dua kali bersamaan.
const inflight = new Map()

// Cache lapis 2: baca dari sessionStorage (tahan refresh, hilang saat tab ditutup)
function readDiskQuery(path) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + path)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Kalau sudah lebih dari 15 menit, anggap kedaluwarsa
    if (Date.now() - parsed.ts > TTL_MS) return null
    return parsed.data
  } catch {
    return null
  }
}

// Simpan jawaban API ke sessionStorage beserta waktu penyimpanannya
function writeDiskQuery(path, data) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + path, JSON.stringify({ ts: Date.now(), data }))
  } catch {
    // Abaikan jika penyimpanan penuh
  }
}

// Cek apakah data untuk alamat ini sudah ada di cache (memori dulu, lalu storage)
export function getCached(path) {
  if (cache.has(path)) return cache.get(path)
  const stored = readDiskQuery(path)
  if (stored) {
    cache.set(path, stored)
    return stored
  }
  return null
}

// Fungsi inti untuk membaca data (GET).
// force = true -> abaikan cache dan paksa ambil baru dari server
async function request(path, { force = false } = {}) {
  // 1) Kalau ada di cache, langsung kembalikan tanpa menghubungi server
  if (!force) {
    const hit = getCached(path)
    if (hit) return hit
  }
  // 2) Kalau permintaan yang sama sedang berjalan, ikut menunggu hasilnya
  if (!force && inflight.has(path)) return inflight.get(path)

  const promise = (async () => {
    let res
    try {
      res = await fetch(`${BASE}${path}`, { cache: force ? 'reload' : 'default' })
    } catch {
      // fetch gagal total = biasanya internet mati / server tidak terjangkau
      throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
    }
    // Server membalas tapi dengan kode error (404, 500, dll)
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(
        body.error ||
          (res.status === 404
            ? 'Data yang dicari tidak ditemukan.'
            : 'Terjadi kendala saat mengambil data dari server.'),
      )
    }
    const data = await res.json()
    // Simpan ke kedua lapis cache
    cache.set(path, data)
    writeDiskQuery(path, data)

    // Trik: saat daftar diambil, tiap item juga disimpan sebagai cache detailnya,
    // jadi membuka halaman detail terasa instan.
    if (path === '/api/motifs' && Array.isArray(data)) {
      data.forEach((m) => {
        cache.set(`/api/motifs/${m.id}`, m)
        writeDiskQuery(`/api/motifs/${m.id}`, m)
      })
    }
    if (path === '/api/regions' && Array.isArray(data)) {
      data.forEach((r) => {
        cache.set(`/api/regions/${r.id}`, r)
        writeDiskQuery(`/api/regions/${r.id}`, r)
      })
    }

    return data
  })()

  inflight.set(path, promise)
  try {
    return await promise
  } finally {
    inflight.delete(path) // permintaan selesai, hapus dari daftar "sedang berjalan"
  }
}

// ---------- Fungsi baca data (dipakai oleh halaman) ----------
export const getMotifs = (opts) => request('/api/motifs', opts)           // semua motif
export const getMotif = (id, opts) => request(`/api/motifs/${id}`, opts)  // satu motif
export const getRegions = (opts) => request('/api/regions', opts)         // semua provinsi
export const getRegion = (id, opts) => request(`/api/regions/${id}`, opts) // satu provinsi

// Baca data dengan pagination (?page=1&limit=9) + filter langsung di API
export const getMotifsPage = ({ page = 1, limit = 9, q = '', category = 'Semua', province = 'Semua' } = {}, opts) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  if (category && category !== 'Semua') params.set('category', category)
  if (province && province !== 'Semua') params.set('province', province)
  return request(`/api/motifs?${params.toString()}`, opts)
}

export const getRegionsPage = ({ page = 1, limit = 12, q = '', provinces = [] } = {}, opts) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (q.trim()) params.set('q', q.trim())
  if (provinces && provinces.length > 0) params.set('provinces', provinces.join(','))
  return request(`/api/regions?${params.toString()}`, opts)
}

// Hapus cache motif. Dipanggil setelah tambah/ubah/hapus supaya data tidak basi.
function clearMotifCache() {
  for (const key of Array.from(cache.keys())) {
    if (key.startsWith('/api/motifs')) cache.delete(key)
  }
  try {
    for (let i = sessionStorage.length - 1; i >= 0; i -= 1) {
      const k = sessionStorage.key(i)
      if (k && k.startsWith(`${STORAGE_PREFIX}/api/motifs`)) sessionStorage.removeItem(k)
    }
  } catch {
    // Abaikan jika sessionStorage tidak tersedia
  }
}

// Fungsi umum untuk MENGUBAH data: POST (tambah), PUT (ubah), DELETE (hapus)
async function mutate(path, method, body) {
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' }, // memberi tahu server: isinya JSON
      body: body ? JSON.stringify(body) : undefined,   // ubah objek jadi teks JSON
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internetmu.')
  }
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody.error || 'Gagal menyimpan perubahan ke server.')
  }
  clearMotifCache() // data berubah -> cache lama dibuang
  return res.json()
}

// ---------- Fungsi CRUD motif & upload foto (dipakai halaman Profil) ----------
export const uploadMotifImage = (image) => mutate('/api/motifs/upload', 'POST', { image }) // Supabase Storage
export const createMotif = (payload) => mutate('/api/motifs', 'POST', payload)            // Create
export const updateMotif = (id, payload) => mutate(`/api/motifs/${id}`, 'PUT', payload) // Update
export const deleteMotif = (id) => mutate(`/api/motifs/${id}`, 'DELETE')                // Delete
