// ============================================================
// Saved.jsx — halaman Disimpan (daftar motif batik favorit pengguna)
// Membaca ID yang disimpan di localStorage lalu mencocokkannya dengan data API.
// ============================================================
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../useFetch.js'
import useSavedMotifs from '../useSavedMotifs.js'
import { getMotifs } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import State from '../components/State.jsx'

export default function Saved() {
  const { data, loading, error, retry } = useFetch(getMotifs, '/api/motifs')
  const { savedIds } = useSavedMotifs()

  useEffect(() => {
    document.title = 'Motif Disimpan · WastraKu'
  }, [])

  // Ambil motif dari API yang ID-nya ada di daftar savedIds
  const savedMotifs = (data || []).filter((m) => savedIds.includes(m.id))

  return (
    <div className="page">
      <h1>Motif Disimpan</h1>
      <p className="muted">Koleksi motif batik pilihanmu yang telah ditandai untuk dibaca kembali.</p>

      <State loading={loading} error={error} onRetry={retry} count={3} />

      {data && savedMotifs.length === 0 && (
        <div className="state empty-box">
          <p>Belum ada motif batik yang disimpan. Buka halaman motif lalu tekan tombol Simpan.</p>
          <Link to="/motifs" className="btn retry-btn" style={{ maxWidth: 220 }}>
            Jelajahi Motif Batik
          </Link>
        </div>
      )}

      {savedMotifs.length > 0 && (
        <>
          <div className="toolbar">
            <span className="count-label">{savedMotifs.length} motif tersimpan</span>
          </div>
          <ul className="list">
            {savedMotifs.map((m) => (
              <MotifCard key={m.id} motif={m} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
