// ============================================================
// useSavedMotifs.js — menyimpan daftar ID motif favorit pengguna
// Disimpan di localStorage browser agar tetap ada walau halaman di-refresh.
// ============================================================
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'wastraku_saved_motifs_v1'

function readSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function useSavedMotifs() {
  const [savedIds, setSavedIds] = useState(readSavedIds)

  // Sinkronkan jika tab lain mengubah localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setSavedIds(readSavedIds())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const persist = (next) => {
    setSavedIds(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Abaikan jika penyimpanan penuh
    }
  }

  // Cek apakah motif sedang tersimpan
  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds])

  // Tambah jika belum ada, hapus jika sudah ada
  const toggleSave = useCallback(
    (id) => {
      if (!id) return
      const next = savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [id, ...savedIds]
      persist(next)
    },
    [savedIds],
  )

  return { savedIds, isSaved, toggleSave }
}
