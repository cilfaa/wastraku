// ============================================================
// Pagination.jsx — tombol navigasi antar halaman (Halaman 1, 2, 3...)
// Dipakai di halaman Motif Batik dan Provinsi agar data tidak dimuat semua sekaligus.
// ============================================================
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null

  const go = (nextPage) => {
    onPageChange(nextPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="pagination" aria-label="Navigasi halaman">
      <button
        type="button"
        className="share-btn"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        ← Sebelumnya
      </button>

      <span className="pagination-info">
        Halaman {page} dari {totalPages}
      </span>

      <button
        type="button"
        className="share-btn"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        Berikutnya →
      </button>
    </nav>
  )
}
