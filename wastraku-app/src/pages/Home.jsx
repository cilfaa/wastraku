// ============================================================
// Home.jsx — halaman Beranda (halaman pertama yang dibuka)
// Isi: judul, jumlah motif & provinsi, pilihan provinsi, motif pilihan.
// ============================================================
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../useFetch.js'
import { getMotifs, getRegions } from '../api.js'
import MotifCard from '../components/MotifCard.jsx'
import RegionCard from '../components/RegionCard.jsx'
import State from '../components/State.jsx'

export default function Home() {
  // Ambil data dari API lewat useFetch (otomatis ada loading/error/cache)
  const motifs = useFetch(getMotifs, '/api/motifs')
  const regions = useFetch(getRegions, '/api/regions')

  // Mengatur judul tab browser
  useEffect(() => {
    document.title = 'WastraKu — Ensiklopedia Digital Batik Nusantara'
  }, [])

  return (
    <div className="page">
      {/* Bagian sambutan di Beranda */}
      <section className="masthead">
        <p className="masthead-eyebrow">WastraKu · Batik Nusantara</p>
        <h1>Selamat Datang</h1>
        <p>Jelajahi ragam motif batik dari 38 provinsi Indonesia, lengkap dengan filosofi dan sejarah budayanya.</p>
      </section>

      {/* Dua kotak angka: jumlah motif dan jumlah provinsi (klik untuk membuka daftarnya) */}
      <section className="stats">
        <Link to="/motifs" className="stat">
          {/* Tanda "–" tampil selagi data belum selesai dimuat */}
          <strong>{motifs.data ? motifs.data.length : '–'}</strong>
          <span>Motif Batik</span>
        </Link>
        <Link to="/regions" className="stat">
          <strong>{regions.data ? regions.data.length : '–'}</strong>
          <span>Provinsi Indonesia</span>
        </Link>
      </section>

      {/* Pilihan provinsi (6 provinsi contoh) */}
      <div className="list-head">
        <h2>Jelajahi per Provinsi</h2>
        <Link to="/regions">Lihat 38 provinsi ›</Link>
      </div>
      <State loading={regions.loading} error={regions.error} onRetry={regions.retry} count={3} />
      <ul className="list">
        {regions.data &&
          ['Jambi', 'DI Yogyakarta', 'Jawa Barat', 'Sumatera Barat', 'Bali', 'Papua']
            // cari data provinsi sesuai nama di atas
            .map((prov) => regions.data.find((r) => r.province === prov))
            // buang yang tidak ketemu
            .filter(Boolean)
            .map((r) => <RegionCard key={r.id} region={r} />)}
      </ul>

      {/* Motif pilihan (6 motif pertama) */}
      <div className="list-head">
        <h2>Motif Pilihan Nusantara</h2>
        <Link to="/motifs">Jelajahi semua ›</Link>
      </div>
      <State loading={motifs.loading} error={motifs.error} onRetry={motifs.retry} count={3} />
      <ul className="list">
        {motifs.data && motifs.data.slice(0, 6).map((m) => <MotifCard key={m.id} motif={m} />)}
      </ul>
    </div>
  )
}
