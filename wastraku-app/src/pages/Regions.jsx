// ============================================================
// Regions.jsx — halaman daftar 38 Provinsi (LIST #2)
// Fitur: pencarian dan filter wilayah (pulau).
// Klik kartu provinsi -> membuka halaman detail (RegionDetail.jsx).
// ============================================================
import { useEffect } from 'react'
import useFetch from '../useFetch.js'
import useQueryFilter from '../useQueryFilter.js'
import { getMotifs, getRegions } from '../api.js'
import RegionCard from '../components/RegionCard.jsx'
import SearchInput from '../components/SearchInput.jsx'
import State from '../components/State.jsx'

// Pengelompokan provinsi per pulau/wilayah untuk tombol filter.
// match: null = tampilkan semua; selain itu = daftar provinsi di wilayah tsb.
const ISLAND_GROUPS = [
  { label: 'Semua', match: null },
  {
    label: 'Sumatera',
    match: [
      'Aceh',
      'Sumatera Utara',
      'Sumatera Barat',
      'Riau',
      'Kepulauan Riau',
      'Jambi',
      'Sumatera Selatan',
      'Kepulauan Bangka Belitung',
      'Bengkulu',
      'Lampung',
    ],
  },
  {
    label: 'Jawa & Bali',
    match: ['DKI Jakarta', 'Jawa Barat', 'Banten', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Bali'],
  },
  { label: 'Nusa Tenggara', match: ['Nusa Tenggara Barat', 'Nusa Tenggara Timur'] },
  {
    label: 'Kalimantan',
    match: ['Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara'],
  },
  {
    label: 'Sulawesi',
    match: [
      'Sulawesi Utara',
      'Sulawesi Tengah',
      'Sulawesi Selatan',
      'Sulawesi Tenggara',
      'Gorontalo',
      'Sulawesi Barat',
    ],
  },
  {
    label: 'Maluku & Papua',
    match: [
      'Maluku',
      'Maluku Utara',
      'Papua',
      'Papua Barat',
      'Papua Selatan',
      'Papua Tengah',
      'Papua Pegunungan',
      'Papua Barat Daya',
    ],
  },
]

export default function Regions() {
  const { data, loading, error, retry } = useFetch(getRegions, '/api/regions')
  const motifsRes = useFetch(getMotifs, '/api/motifs')
  const { getParam, setParam: updateParam, resetParams: resetFilter } = useQueryFilter()

  // Foto cadangan per provinsi: dipakai kalau provinsi tidak punya foto landmark.
  // Diambil dari foto motif pertama milik provinsi tersebut.
  const regionImages = new Map()
  ;(motifsRes.data || []).forEach((m) => {
    if (m.region_id && m.image_url && !regionImages.has(m.region_id)) {
      regionImages.set(m.region_id, m.image_url)
    }
  })

  const island = getParam('wilayah', 'Semua') // wilayah yang dipilih
  const q = getParam('q', '')                 // kata kunci pencarian

  useEffect(() => {
    document.title = 'Provinsi Batik · WastraKu'
  }, [])

  const group = ISLAND_GROUPS.find((g) => g.label === island) || ISLAND_GROUPS[0]
  const query = q.trim().toLowerCase()

  // Menyaring provinsi sesuai wilayah dan kata kunci
  const shown = (data || []).filter((r) => {
    const matchIsland = !group.match || group.match.includes(r.province)
    const matchQuery =
      !query ||
      [r.province, r.name, r.characteristic, r.description].filter(Boolean).join(' ').toLowerCase().includes(query)
    return matchIsland && matchQuery
  })

  return (
    <div className="page">
      <h1>Provinsi Batik Nusantara</h1>
      <p className="muted">Eksplorasi kekhasan corak dan warna batik dari Sabang sampai Merauke.</p>

      {/* Pencarian & dropdown filter wilayah */}
      <div className="filter-bar">
        <SearchInput
          placeholder="Cari nama provinsi, kota, atau ciri khas batik…"
          value={q}
          onChange={(e) => updateParam('q', e.target.value, '')}
        />

        <select
          className="province-select"
          value={island}
          onChange={(e) => updateParam('wilayah', e.target.value, 'Semua')}
          aria-label="Filter wilayah Indonesia"
        >
          {ISLAND_GROUPS.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label === 'Semua' ? 'Semua Wilayah' : g.label}
            </option>
          ))}
        </select>
      </div>

      {/* Jumlah provinsi yang tampil */}
      {data && (
        <div className="toolbar">
          <span className="count-label">{shown.length} provinsi</span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={6} />

      {/* Pesan kalau tidak ada hasil */}
      {data && shown.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada provinsi yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      {/* Daftar kartu provinsi */}
      <ul className="list">
        {shown.map((r) => (
          <RegionCard key={r.id} region={r} imageUrl={regionImages.get(r.id)} />
        ))}
      </ul>
    </div>
  )
}
