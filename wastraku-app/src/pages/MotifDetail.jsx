// ============================================================
// MotifDetail.jsx — halaman detail SATU motif batik
// Menampilkan foto, filosofi, sejarah, simbolisme, deskripsi,
// ringkasan, dan motif lain dari provinsi yang sama.
// ============================================================
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotif, getMotifs } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import ShareButton from '../components/ShareButton.jsx'
import State from '../components/State.jsx'
import { MotifThumb } from '../components/Thumbs.jsx'

export default function MotifDetail() {
  // useParams membaca :id dari URL (/motifs/:id)
  const { id } = useParams()
  const navigate = useNavigate()
  // Ambil data satu motif sesuai id
  const { data: motif, loading, error, retry } = useFetch((opts) => getMotif(id, opts), `/api/motifs/${id}`)
  // Ambil semua motif (untuk mencari motif lain dari provinsi yang sama)
  const allMotifs = useFetch(getMotifs, '/api/motifs')

  // Judul tab browser = nama motif
  useEffect(() => {
    document.title = motif ? `${motif.name} · WastraKu` : 'Detail Motif · WastraKu'
  }, [motif])

  // Tombol kembali: mundur satu halaman, atau ke daftar motif kalau tidak ada riwayat
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/motifs')
  }

  // Motif lain yang provinsinya sama (motif yang sedang dibuka tidak ikut)
  const otherSameRegionMotifs =
    motif && allMotifs.data
      ? allMotifs.data.filter(
          (m) => m.id !== motif.id && (m.region_id === motif.region_id || m.regions?.id === motif.regions?.id),
        )
      : []

  return (
    <div className="page">
      <div className="detail-actions">
        <button type="button" className="back" onClick={handleBack}>
          ← Kembali
        </button>
        {motif && <ShareButton title={`${motif.name} · WastraKu`} text={motif.philosophy} />}
      </div>

      {/* Loading / error */}
      <State loading={loading} error={error} onRetry={retry} detail />

      {/* Isi halaman baru tampil kalau data motif sudah ada */}
      {motif && (
        <>
          <MotifThumb motif={motif} size="lg" />
          <h1>{motif.name}</h1>
          <div className="detail-meta">
            <span className={`tag cat-${motif.category.toLowerCase()}`}>{motif.category}</span>
            <span className="tag">{motif.occasion}</span>
            {motif.regions && (
              <span className="muted">
                {motif.regions.province} · {motif.regions.name}
              </span>
            )}
          </div>

          <section className="panel philosophy-box">
            <h2>Makna &amp; Filosofi</h2>
            <p>{motif.philosophy}</p>
          </section>

          <div className="detail-grid">
            {/* Sejarah & simbolisme hanya tampil kalau datanya terisi */}
            {motif.history && (
              <section className="panel">
                <h2>Sejarah Budaya</h2>
                <p>{motif.history}</p>
              </section>
            )}

            {motif.symbolism && (
              <section className="panel">
                <h2>Simbolisme</h2>
                <p>{motif.symbolism}</p>
              </section>
            )}
          </div>

          <section className="panel">
            <h2>Deskripsi Pola &amp; Ornamen</h2>
            <p>{motif.description}</p>
          </section>

          {/* Tabel ringkasan informasi */}
          <h2>Ringkasan Informasi</h2>
          <dl className="spec">
            <dt>Nama Motif</dt>
            <dd>{motif.name}</dd>
            <dt>Provinsi</dt>
            <dd>{motif.regions ? motif.regions.province : '-'}</dd>
            <dt>Daerah Asal</dt>
            <dd>{motif.regions ? motif.regions.name : '-'}</dd>
            <dt>Kategori</dt>
            <dd>{motif.category}</dd>
            <dt>Penggunaan Adat</dt>
            <dd>{motif.occasion}</dd>
          </dl>

          {/* Motif lain dari provinsi yang sama (kalau ada) */}
          {otherSameRegionMotifs.length > 0 && (
            <>
              <div className="list-head">
                <h2>Motif Lainnya dari {motif.regions?.province || 'Daerah Ini'}</h2>
              </div>
              <ul className="list">
                {otherSameRegionMotifs.map((m) => (
                  <MotifCard key={m.id} motif={m} />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
