// ============================================================
// MotifCard.jsx — kartu kecil untuk SATU motif batik (dipakai di daftar)
// Bisa diklik untuk membuka halaman detail motif.
// ============================================================
import { Link } from 'react-router-dom'
import { MotifThumb } from './Thumbs.jsx'

// motif     = data satu motif
// linkState = info tambahan yang dibawa saat pindah halaman (opsional)
export default function MotifCard({ motif, linkState }) {
  // Teks asal: "Provinsi · Kota", atau "Nusantara" kalau tidak ada data provinsi
  const origin = motif.regions
    ? `${motif.regions.province} · ${motif.regions.name}`
    : 'Nusantara'

  return (
    <li>
      <Link to={`/motifs/${motif.id}`} state={linkState} className="card">
        <MotifThumb motif={motif} size="card" />
        <div className="card-body">
          <h3>{motif.name}</h3>
          <p className="muted">{origin}</p>
          <div className="card-foot">
            {/* Label kategori (Keraton/Pesisir/dll), warnanya mengikuti kategori */}
            <span className={`tag cat-${motif.category.toLowerCase()}`}>{motif.category}</span>
            <span className="chevron" aria-hidden="true">
              ›
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
