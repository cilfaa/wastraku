// ============================================================
// RegionDetail.jsx — halaman detail SATU provinsi
// Menampilkan foto landmark, ciri khas batik, sejarah daerah,
// dan daftar motif batik yang berasal dari provinsi tersebut.
// ============================================================
import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegion } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { RegionThumb } from '../components/Thumbs.jsx'
import State from '../components/State.jsx'

export default function RegionDetail() {
  // id provinsi dari URL (/regions/:id)
  const { id } = useParams()
  const navigate = useNavigate()
  // location.state = info titipan dari halaman sebelumnya (kalau ada),
  // misalnya motif mana yang tadi dibuka, agar tidak ditampilkan lagi.
  const location = useLocation()
  const fromMotifId = location.state?.fromMotifId
  const fromMotifName = location.state?.fromMotifName
  // Ambil data satu provinsi, dan semua motif (untuk disaring per provinsi)
  const { data: region, loading, error, retry } = useFetch((opts) => getRegion(id, opts), `/api/regions/${id}`)
  const motifList = useFetch(getMotifs, '/api/motifs')

  useEffect(() => {
    document.title = region ? `${region.province} · WastraKu` : 'Detail Provinsi · WastraKu'
  }, [region])

  // Tombol kembali: mundur satu halaman, atau ke daftar provinsi kalau tidak ada riwayat
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) navigate(-1)
    else navigate('/regions')
  }

  // Semua motif milik provinsi ini
  const regionalMotifs = (motifList.data || []).filter((m) => m.region_id === id || m.regions?.id === id)
  // Kalau datang dari halaman sebuah motif, motif itu disembunyikan dari daftar
  const visibleMotifs = fromMotifId ? regionalMotifs.filter((m) => m.id !== fromMotifId) : regionalMotifs
  // Foto motif pertama, dipakai sebagai foto cadangan
  const regionalMotif = regionalMotifs.find((m) => m.image_url)

  return (
    <div className="page">
      <div className="detail-actions">
        <button type="button" className="back" onClick={handleBack}>
          ← Kembali
        </button>
        {region && <ShareButton title={`Batik ${region.province} · WastraKu`} text={region.characteristic} />}
      </div>

      <State loading={loading} error={error} onRetry={retry} detail />

      {region && (
        <>
          <RegionThumb region={region} imageUrl={regionalMotif?.image_url} size="lg" />
          <h1>{region.province}</h1>
          <p className="muted">{region.name}</p>

          <section className="panel philosophy-box">
            <h2>Ciri Khas Batik</h2>
            <p>{region.characteristic}</p>
          </section>

          <section className="panel">
            <h2>Sejarah &amp; Latar Budaya</h2>
            <p>{region.description}</p>
          </section>

          {/* Daftar motif provinsi ini; kalau kosong tampilkan keterangan */}
          {visibleMotifs.length > 0 ? (
            <>
              <div className="list-head">
                <h2>{fromMotifId ? `Motif Lainnya dari ${region.province}` : `Motif Batik ${region.province}`}</h2>
                {/* Tautan ke katalog hanya muncul kalau motifnya lebih dari satu */}
                {regionalMotifs.length > 1 && (
                  <Link to={`/motifs?provinsi=${encodeURIComponent(region.province)}`}>Lihat di Katalog ›</Link>
                )}
              </div>
              <ul className="list">
                {visibleMotifs.map((m) => (
                  // linkState membawa id provinsi ke halaman motif
                  <MotifCard key={m.id} motif={m} linkState={{ fromRegionId: region.id }} />
                ))}
              </ul>
            </>
          ) : (
            <section className="panel">
              <h2>Motif Batik {region.province}</h2>
              <p className="muted">
                {fromMotifId
                  ? `Saat ini baru tercatat 1 motif unggulan dari ${region.province}${fromMotifName ? ` (${fromMotifName})` : ''}.`
                  : 'Belum ada motif terdaftar untuk provinsi ini.'}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  )
}
