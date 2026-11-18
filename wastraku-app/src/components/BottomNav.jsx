// ============================================================
// BottomNav.jsx — menu navigasi di bagian bawah layar HP
// (syarat TA: Bottom Navigation Bar)
// ============================================================
import { NavLink } from 'react-router-dom'
import { IconHome, IconMotif, IconRegion, IconUser } from './Icons.jsx'

// Daftar menu: alamat tujuan, tulisan, dan ikonnya
const ITEMS = [
  { to: '/', label: 'Beranda', Icon: IconHome, end: true },
  { to: '/motifs', label: 'Motif', Icon: IconMotif },
  { to: '/regions', label: 'Daerah', Icon: IconRegion },
  { to: '/about', label: 'Profil', Icon: IconUser },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      {/* map = membuat satu tombol menu untuk setiap item di daftar */}
      {ITEMS.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          // Menu yang sedang dibuka diberi class "active" (warna berbeda)
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <span className="nav-icon">
            <it.Icon />
          </span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
