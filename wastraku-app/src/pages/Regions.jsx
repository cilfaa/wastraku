// ============================================================
// Regions.jsx — halaman daftar Provinsi (LIST #2)
// Fitur: pencarian, filter wilayah (pulau), dan PAGINATION
// (memuat 12 provinsi per halaman agar gambar landmark ringan).
// ============================================================
import { useEffect } from 'react'
import useFetch from '../useFetch.js'
import useQueryFilter from '../useQueryFilter.js'
import { getRegionsPage } from '../api.js'
import Pagination from '../components/Pagination.jsx'
import RegionCard from '../components/RegionCard.jsx'
import SearchInput from '../components/SearchInput.jsx'
import State from '../components/State.jsx'

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

const PAGE_LIMIT = 12

export default function Regions() {
  const { getParam, setParam, resetParams: resetFilter } = useQueryFilter()

  const island = getParam('wilayah', 'Semua')
  const q = getParam('q', '')
  const page = Math.max(1, Number.parseInt(getParam('hal', '1'), 10) || 1)

  const group = ISLAND_GROUPS.find((g) => g.label === island) || ISLAND_GROUPS[0]
  const provinces = group.match || []

  const pathKey = `/api/regions?page=${page}&limit=${PAGE_LIMIT}&q=${encodeURIComponent(q)}&wilayah=${encodeURIComponent(island)}`
  const { data, loading, error, retry } = useFetch(
    (opts) => getRegionsPage({ page, limit: PAGE_LIMIT, q, provinces }, opts),
    pathKey,
  )

  useEffect(() => {
    document.title = 'Provinsi Batik · WastraKu'
  }, [])

  const items = data?.items || []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const handleFilterChange = (key, val, defaultVal) => {
    setParam(key, val, defaultVal)
    if (key !== 'hal' && page !== 1) setParam('hal', '1', '1')
  }

  return (
    <div className="page">
      <h1>Provinsi Batik Nusantara</h1>
      <p className="muted">Eksplorasi kekhasan corak dan warna batik dari Sabang sampai Merauke.</p>

      <div className="filter-bar">
        <SearchInput
          placeholder="Cari nama provinsi, kota, atau ciri khas batik…"
          value={q}
          onChange={(e) => handleFilterChange('q', e.target.value, '')}
        />

        <select
          className="province-select"
          value={island}
          onChange={(e) => handleFilterChange('wilayah', e.target.value, 'Semua')}
          aria-label="Filter wilayah Indonesia"
        >
          {ISLAND_GROUPS.map((g) => (
            <option key={g.label} value={g.label}>
              {g.label === 'Semua' ? 'Semua Wilayah' : g.label}
            </option>
          ))}
        </select>
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">
            Menampilkan {items.length} dari {total} provinsi
          </span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={6} />

      {data && items.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada provinsi yang cocok dengan pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset filter
          </button>
        </div>
      )}

      <ul className="list">
        {items.map((r) => (
          <RegionCard key={r.id} region={r} />
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(next) => setParam('hal', String(next), '1')}
      />
    </div>
  )
}
