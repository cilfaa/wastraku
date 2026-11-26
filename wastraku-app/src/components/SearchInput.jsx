// ============================================================
// SearchInput.jsx — kotak pencarian dengan ikon kaca pembesar di kiri
// Dipakai ulang di halaman Motif, Provinsi, dan CRUD Profil.
// ============================================================
import { IconSearch } from './Icons.jsx'

export default function SearchInput({ value, onChange, placeholder, style }) {
  return (
    <div className="search-wrap" style={style}>
      <span className="search-icon" aria-hidden="true">
        <IconSearch />
      </span>
      <input
        className="search search-with-icon"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
