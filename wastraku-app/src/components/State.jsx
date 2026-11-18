// ============================================================
// State.jsx — tampilan saat data sedang dimuat atau gagal dimuat
// - loading : kotak abu-abu berkedip (skeleton) sebagai pengganti
// - error   : pesan gagal + tombol "Coba lagi"
// - normal  : tidak menampilkan apa-apa (return null)
// ============================================================
export default function State({ loading, error, onRetry, count = 4, detail = false }) {
  if (loading) {
    // Mode detail: kerangka untuk halaman detail
    if (detail) {
      return (
        <div className="skeleton-detail" aria-busy="true" aria-label="Memuat detail">
          <div className="skel skel-title" />
          <div className="skel skel-sub" />
          <div className="skel skel-price" />
          <div className="skel skel-block" />
        </div>
      )
    }
    // Mode daftar: tampilkan sejumlah `count` kartu kerangka
    return (
      <ul className="list" aria-busy="true" aria-label="Memuat daftar">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="card skel-card">
            <div className="card-main" style={{ width: '65%' }}>
              <div className="skel skel-line-lg" />
              <div className="skel skel-line-sm" />
              <div className="skel skel-pill" />
            </div>
            <div className="skel skel-right" />
          </li>
        ))}
      </ul>
    )
  }

  // Kalau terjadi error, tampilkan pesan + tombol coba lagi
  if (error) {
    return (
      <div className="state error-box" role="alert">
        <p className="error-title">Gagal memuat data</p>
        <p className="muted">
          Sepertinya koneksi sedang bermasalah atau server sedang sibuk. Silakan coba muat ulang.
        </p>
        {onRetry && (
          <button type="button" className="btn retry-btn" onClick={onRetry}>
            Coba lagi
          </button>
        )}
      </div>
    )
  }

  return null
}
