// ============================================================
// App.jsx — kerangka utama aplikasi + peta halaman (routing)
// Menentukan: URL apa menampilkan halaman apa, plus menu navigasi.
// ============================================================
import { useEffect } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './pages/Home.jsx'
import Motifs from './pages/Motifs.jsx'
import MotifDetail from './pages/MotifDetail.jsx'
import Regions from './pages/Regions.jsx'
import RegionDetail from './pages/RegionDetail.jsx'
import About from './pages/About.jsx'
import './App.css'

// Setiap pindah halaman, layar otomatis kembali ke paling atas
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null // komponen ini tidak menampilkan apa-apa
}

// Halaman 404: tampil kalau alamat URL tidak dikenal
function NotFound() {
  useEffect(() => {
    document.title = 'Halaman Tidak Ditemukan · WastraKu'
  }, [])

  return (
    <div className="page state not-found">
      <h1>404</h1>
      <p>Halaman yang kamu cari tidak ditemukan atau sudah dipindahkan.</p>
      <Link to="/" className="btn">
        Kembali ke Beranda
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="shell">
      <ScrollToTop />

      {/* Menu atas: hanya muncul di layar besar (laptop) */}
      <header className="top-bar">
        <Link to="/" className="top-brand">
          Wastra<span>Ku</span>
        </Link>
        <nav className="top-links" aria-label="Navigasi desktop">
          {/* NavLink otomatis memberi class "active" pada menu yang sedang dibuka */}
          <NavLink to="/" end className={({ isActive }) => 'top-link' + (isActive ? ' active' : '')}>
            Beranda
          </NavLink>
          <NavLink to="/motifs" className={({ isActive }) => 'top-link' + (isActive ? ' active' : '')}>
            Motif Batik
          </NavLink>
          <NavLink to="/regions" className={({ isActive }) => 'top-link' + (isActive ? ' active' : '')}>
            38 Provinsi
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => 'top-link' + (isActive ? ' active' : '')}>
            Profil
          </NavLink>
        </nav>
      </header>

      {/* Isi halaman berganti sesuai URL */}
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/motifs" element={<Motifs />} />
          <Route path="/motifs/:id" element={<MotifDetail />} />   {/* :id = nomor motif */}
          <Route path="/regions" element={<Regions />} />
          <Route path="/regions/:id" element={<RegionDetail />} /> {/* :id = nomor provinsi */}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />                {/* * = semua alamat lain */}
        </Routes>
      </main>

      {/* Menu bawah: muncul di HP (Bottom Navigation Bar) */}
      <BottomNav />
    </div>
  )
}
