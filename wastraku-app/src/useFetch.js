// ============================================================
// useFetch.js — "hook" (alat bantu React) untuk mengambil data
// Memberi tahu halaman: datanya mana (data), sedang loading (loading),
// ada error (error), dan fungsi untuk coba lagi (retry).
// ============================================================
import { useCallback, useEffect, useState } from 'react'
import { getCached } from './api.js'

// fetcher = fungsi pengambil data (mis. getMotifs)
// pathKey = alamat API, dipakai sebagai kunci untuk mengecek cache
export default function useFetch(fetcher, pathKey) {
  // Kalau data sudah ada di cache, langsung dipakai (tidak perlu loading)
  const initial = pathKey ? getCached(pathKey) : null
  const [data, setData] = useState(initial)
  const [loading, setLoading] = useState(!initial)
  const [error, setError] = useState('')
  const [tick, setTick] = useState(0) // naik 1 setiap tombol "Coba lagi" ditekan

  useEffect(() => {
    let alive = true // penanda: halaman masih dibuka atau sudah ditinggalkan
    const cached = pathKey && tick === 0 ? getCached(pathKey) : null
    if (cached) {
      setData(cached)
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    // force: true saat "Coba lagi" supaya benar-benar ambil ulang dari server
    fetcher({ force: tick > 0 })
      .then((d) => {
        if (alive) setData(d)
      })
      .catch((e) => {
        if (alive) setError(e.message || 'Gagal memuat data.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })

    // Dijalankan saat halaman ditinggalkan: jangan update tampilan lagi
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathKey, tick])

  // Fungsi untuk memicu pengambilan ulang data
  const retry = useCallback(() => setTick((t) => t + 1), [])

  return { data, loading, error, retry }
}
