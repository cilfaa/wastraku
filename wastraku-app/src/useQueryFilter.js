// ============================================================
// useQueryFilter.js — menyimpan pencarian/filter di URL
// Contoh: /motifs?provinsi=Jambi&q=angsa
// Keuntungan: link hasil filter bisa dibagikan dan tetap ada saat refresh.
// ============================================================
import { useSearchParams } from 'react-router-dom'

export default function useQueryFilter() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Baca nilai filter dari URL (pakai nilai cadangan kalau belum ada)
  const getParam = (key, fallback = '') => searchParams.get(key) || fallback

  // Ubah satu filter di URL. Kalau nilainya kosong/default, filter dihapus dari URL.
  const setParam = (key, val, defaultVal = '') => {
    const next = new URLSearchParams(searchParams)
    if (!val || val === defaultVal) next.delete(key)
    else next.set(key, val)
    setSearchParams(next, { replace: true })
  }

  // Hapus semua filter sekaligus
  const resetParams = () => setSearchParams({}, { replace: true })

  return { getParam, setParam, resetParams }
}
