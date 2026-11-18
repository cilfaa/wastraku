// ============================================================
// Thumbs.jsx — komponen penampil foto (thumbnail)
// - MotifThumb  : foto kain batik untuk sebuah motif
// - RegionThumb : foto landmark untuk sebuah provinsi
// Kalau foto gagal dimuat (offline / link rusak), otomatis tampil
// gambar pola SVG cadangan supaya kotaknya tidak kosong.
// ============================================================
import { useState } from 'react'
import { PROVINCE_LANDMARKS } from '../data/provinceLandmarks.js'

// Memilih warna pola cadangan sesuai kategori motif
function getMotifPalette(motif) {
  const cat = String(motif?.category || '').toLowerCase()
  if (cat === 'pesisir') return { bg: '#e0f2fe', primary: '#0369a1', secondary: '#d97706' }
  if (cat === 'pedalaman') return { bg: '#fce7f3', primary: '#9d174d', secondary: '#b45309' }
  if (cat === 'nusantara') return { bg: '#dcfce7', primary: '#166534', secondary: '#b45309' }
  return { bg: '#fef3c7', primary: '#92400e', secondary: '#b45309' }
}

// Gambar pola belah ketupat sederhana (SVG), dipakai sebagai foto cadangan
function MotifFallbackSvg({ motif }) {
  const { bg, primary, secondary } = getMotifPalette(motif)
  return (
    <svg viewBox="0 0 120 80" className="thumb-svg" style={{ background: bg }} aria-hidden="true">
      {/* Menggambar 3 kolom x 2 baris pola */}
      {[25, 60, 95].map((cx) =>
        [22, 58].map((cy) => (
          <g key={`${cx}-${cy}`} transform={`translate(${cx},${cy})`} fill="none" stroke={primary} strokeWidth="2">
            <path d="M0 -13 L11 0 L0 13 L-11 0 Z" fill={primary} fillOpacity="0.12" />
            <circle r="4" stroke={secondary} fill={secondary} fillOpacity="0.3" />
          </g>
        )),
      )}
    </svg>
  )
}

// Foto lama yang ada watermark toko online -> diganti otomatis dengan foto bersih
const WATERMARKED_WIKIMEDIA_FILE = 'Detail_batik_motif_sekar_jagad_warna_merah_khas_pekalongan.jpg'
const CLEAN_SEKAR_JAGAD_URL =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Kain_batik_motif_sekar_jagad.jpg?width=800'

// Foto motif batik
export function MotifThumb({ motif, size = 'card' }) {
  const [imgError, setImgError] = useState(false) // true kalau foto gagal dimuat
  const rawSrc = motif?.image_url
  const src = rawSrc?.includes(WATERMARKED_WIKIMEDIA_FILE) ? CLEAN_SEKAR_JAGAD_URL : rawSrc

  return (
    <div className={`thumb-box thumb-${size}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={`Pola motif batik ${motif?.name || 'Nusantara'}`}
          className="thumb-img"
          loading="lazy" // foto baru dimuat saat hampir terlihat (hemat kuota)
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)} // kalau gagal -> pakai SVG cadangan
        />
      ) : (
        <MotifFallbackSvg motif={motif} />
      )}
    </div>
  )
}

// Foto landmark provinsi (mis. Jakarta -> Monas)
export function RegionThumb({ region, imageUrl, size = 'sm' }) {
  const [imgError, setImgError] = useState(false)
  // Cari foto landmark berdasarkan nama provinsi di data/provinceLandmarks.js
  const landmark = PROVINCE_LANDMARKS[region?.province]
  // Prioritas: foto landmark, kalau tidak ada pakai foto batik (imageUrl)
  const src = landmark?.url || imageUrl
  // Teks alternatif untuk pembaca layar / saat gambar tidak tampil
  const altText = landmark?.label
    ? `${landmark.label}, ${region?.province}`
    : `Batik khas ${region?.province || region?.name || 'Nusantara'}`

  return (
    <div className={`thumb-box thumb-${size}`}>
      {src && !imgError ? (
        <img
          src={src}
          alt={altText}
          className="thumb-img"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <MotifFallbackSvg motif={{ category: 'Nusantara' }} />
      )}
    </div>
  )
}
