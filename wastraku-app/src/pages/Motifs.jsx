// ============================================================
// Motifs.jsx — halaman daftar Motif Batik (LIST #1)
// Fitur: pencarian, filter provinsi, filter kategori.
// Klik kartu motif -> membuka halaman detail (MotifDetail.jsx).
// ============================================================
import { useEffect } from 'react'
import useFetch from '../useFetch.js'
import useQueryFilter from '../useQueryFilter.js'
import { getMotifs, getRegions } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import State from '../components/State.jsx'

// Pilihan tombol kategori
const CATEGORIES = ['Semua', 'Keraton', 'Pesisir', 'Pedalaman', 'Nusantara']

export default function Motifs() {
  const { data, loading, error, retry } = useFetch(getMotifs, '/api/motifs')
  const regionsRes = useFetch(getRegions, '/api/regions')
  // Filter disimpan di URL (lihat useQueryFilter.js)
  const { getParam, setParam: updateParam, resetParams: resetFilter } = useQueryFilter()

  const category = getParam('kategori', 'Semua')
  const province = getParam('provinsi', 'Semua')
  const q = getParam('q', '') // kata kunci pencarian

  useEffect(() => {
    document.title = 'Katalog Motif Batik · WastraKu'
  }, [])

  // Daftar nama provinsi unik untuk isi dropdown, diurutkan A-Z
  const provinces = Array.from(
    new Set((regionsRes.data || []).map((r) => r.province).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  const query = q.trim().toLowerCase()

  // Menyaring motif sesuai kategori, provinsi, dan kata kunci
  const shown = (data || []).filter((m) => {
    const matchCat = category === 'Semua' || m.category === category
    const matchProv = province === 'Semua' || m.regions?.province === province
    if (!matchCat || !matchProv) return false
    if (!query) return true

    // Pencarian: semua teks motif digabung jadi satu, lalu dicek apakah mengandung kata kunci
    // (nama, kategori, acara adat, filosofi, sejarah, simbolisme, deskripsi, kota, provinsi)
    const haystack = [
      m.name,
      m.category,
      m.occasion,
      m.philosophy,
      m.history,
      m.symbolism,
      m.description,
      m.regions?.name,
      m.regions?.province,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })

  return (
    <div className="page">
      <h1>Katalog Motif Batik</h1>
      <p className="muted">Cari berdasarkan nama motif, provinsi, kota asal, filosofi, atau acara adat.</p>

      <div className="filter-bar">
        {/* Kolom pencarian: setiap ketikan langsung memperbarui URL & hasil */}
        <input
          className="search"
          type="search"
          placeholder="Cari motif, provinsi, filosofi, atau acara…"
          value={q}
          onChange={(e) => updateParam('q', e.target.value, '')}
        />

        {/* Dropdown filter provinsi */}
        <select
          className="province-select"
          value={province}
          onChange={(e) => updateParam('provinsi', e.target.value, 'Semua')}
          aria-label="Filter berdasarkan provinsi"
        >
          <option value="Semua">Semua Provinsi ({provinces.length || 38})</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Tombol filter kategori. Yang aktif diberi class "on" */}
      <div className="chips" role="group" aria-label="Filter kategori batik">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={'chip' + (category === c ? ' on' : '')}
            onClick={() => updateParam('kategori', c, 'Semua')}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Keterangan jumlah hasil */}
      {data && (
        <div className="toolbar">
          <span className="count-label">
            Menampilkan {shown.length} motif batik
            {province !== 'Semua' ? ` dari ${province}` : ''}
          </span>
        </div>
      )}

      {/* Tampil saat loading / error */}
      <State loading={loading} error={error} onRetry={retry} count={6} />

      {/* Tampil kalau tidak ada hasil yang cocok */}
      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada motif batik yang cocok dengan filter atau pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset semua filter
          </button>
        </div>
      )}

      {/* Daftar kartu motif hasil saringan */}
      <ul className="list">
        {shown.map((m) => (
          <MotifCard key={m.id} motif={m} />
        ))}
      </ul>
    </div>
  )
}
