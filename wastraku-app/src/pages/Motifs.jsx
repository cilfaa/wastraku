// ============================================================
// Motifs.jsx — halaman daftar Motif Batik (LIST #1)
// Fitur: pencarian, filter provinsi, filter kategori, dan PAGINATION
// (memuat 9 motif per halaman langsung dari API agar ringan & cepat).
// ============================================================
import { useEffect } from 'react'
import useFetch from '../useFetch.js'
import useQueryFilter from '../useQueryFilter.js'
import { getMotifsPage, getRegions } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import Pagination from '../components/Pagination.jsx'
import SearchInput from '../components/SearchInput.jsx'
import State from '../components/State.jsx'

const CATEGORIES = ['Semua', 'Keraton', 'Pesisir', 'Pedalaman', 'Nusantara']
const PAGE_LIMIT = 9

export default function Motifs() {
  const regionsRes = useFetch(getRegions, '/api/regions')
  const { getParam, setParam, resetParams: resetFilter } = useQueryFilter()

  const category = getParam('kategori', 'Semua')
  const province = getParam('provinsi', 'Semua')
  const q = getParam('q', '')
  const page = Math.max(1, Number.parseInt(getParam('hal', '1'), 10) || 1)

  const pathKey = `/api/motifs?page=${page}&limit=${PAGE_LIMIT}&q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}&province=${encodeURIComponent(province)}`
  const { data, loading, error, retry } = useFetch(
    (opts) => getMotifsPage({ page, limit: PAGE_LIMIT, q, category, province }, opts),
    pathKey,
  )

  useEffect(() => {
    document.title = 'Katalog Motif Batik · WastraKu'
  }, [])

  // Daftar nama provinsi unik untuk isi dropdown, diurutkan A-Z
  const provinces = Array.from(
    new Set((regionsRes.data || []).map((r) => r.province).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  const items = data?.items || []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const handleFilterChange = (key, val, defaultVal) => {
    setParam(key, val, defaultVal)
    if (key !== 'hal' && page !== 1) setParam('hal', '1', '1')
  }

  return (
    <div className="page">
      <h1>Katalog Motif Batik</h1>
      <p className="muted">Cari berdasarkan nama motif, provinsi, kota asal, filosofi, atau acara adat.</p>

      <div className="filter-bar filter-bar-3">
        <SearchInput
          placeholder="Cari motif, filosofi, atau acara…"
          value={q}
          onChange={(e) => handleFilterChange('q', e.target.value, '')}
        />

        <select
          className="province-select"
          value={category}
          onChange={(e) => handleFilterChange('kategori', e.target.value, 'Semua')}
          aria-label="Filter kategori batik"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === 'Semua' ? 'Semua Kategori' : `Kategori: ${c}`}
            </option>
          ))}
        </select>

        <select
          className="province-select"
          value={province}
          onChange={(e) => handleFilterChange('provinsi', e.target.value, 'Semua')}
          aria-label="Filter berdasarkan provinsi"
        >
          <option value="Semua">Semua Provinsi</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {data && (
        <div className="toolbar">
          <span className="count-label">
            Menampilkan {items.length} dari {total} motif batik
            {province !== 'Semua' ? ` (${province})` : ''}
          </span>
        </div>
      )}

      <State loading={loading} error={error} onRetry={retry} count={6} />

      {data && items.length === 0 && (
        <div className="state empty-box">
          <p>Tidak ada motif batik yang cocok dengan filter atau pencarianmu.</p>
          <button type="button" className="chip on" onClick={resetFilter}>
            Reset semua filter
          </button>
        </div>
      )}

      <ul className="list">
        {items.map((m) => (
          <MotifCard key={m.id} motif={m} />
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
