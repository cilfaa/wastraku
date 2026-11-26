// ============================================================
// About.jsx — halaman Profil + Penjelasan App + CRUD motif batik
// - Bagian atas: profil pembuat & penjelasan WastraKu
// - Bagian tengah: form Tambah / Edit motif (dengan unggah gambar langsung)
// - Bagian bawah: daftar motif dengan filter provinsi/pencarian + Edit/Hapus
// ============================================================
import { useEffect, useRef, useState } from 'react'
import useFetch from '../useFetch.js'
import { createMotif, deleteMotif, getMotifs, getRegions, updateMotif } from '../api.js'
import SearchInput from '../components/SearchInput.jsx'

// Data diri pembuat
const PROFILE = {
  nama: 'Greycilfa',
  nim: '21120124140158',
  kelas: 'Praktikum PPB 2026',
  github: 'https://github.com/cilfaa/wastraku',
}

// Pilihan kategori pada form
const CATEGORIES = ['Keraton', 'Pesisir', 'Pedalaman', 'Nusantara']

// Isi awal form (form kosong)
const EMPTY_FORM = {
  name: '',
  region_id: '',
  category: 'Nusantara',
  occasion: 'Acara Resmi',
  philosophy: '',
  description: '',
  image_url: '',
}

// Memperkecil & mengubah file gambar menjadi teks Data URL (base64)
// agar langsung bisa disimpan ke database dan ditampilkan tanpa link luar.
function compressImageToDataUrl(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('File bukan gambar yang valid.'))
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function About() {
  // Ambil daftar motif dan provinsi dari API
  const motifsRes = useFetch(getMotifs, '/api/motifs')
  const regionsRes = useFetch(getRegions, '/api/regions')
  const fileInputRef = useRef(null)

  // State form & filter daftar CRUD
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [filterProvince, setFilterProvince] = useState('Semua')
  const [showAll, setShowAll] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', text: '' })

  useEffect(() => {
    document.title = 'Profil & Kelola Data · WastraKu'
  }, [])

  const regions = regionsRes.data || []
  const motifs = motifsRes.data || []

  const provinceOptions = Array.from(
    new Set(regions.map((r) => r.province).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b))

  // Menyaring daftar motif sesuai provinsi & kata kunci pencarian
  const filteredMotifs = motifs.filter((m) => {
    if (filterProvince !== 'Semua' && m.regions?.province !== filterProvince) return false
    const q = filterText.trim().toLowerCase()
    if (!q) return true
    return [m.name, m.category, m.regions?.province, m.regions?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  })

  // Supaya daftar CRUD tidak memanjang ke bawah, tampilkan 5 dulu saat belum difilter
  const isFiltered = filterProvince !== 'Semua' || filterText.trim() !== ''
  const visibleMotifs = isFiltered || showAll ? filteredMotifs : filteredMotifs.slice(0, 5)

  // Dipanggil setiap pengguna mengetik di kolom form
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Dipanggil saat pengguna memilih gambar langsung dari galeri/komputer
  const handleImageFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await compressImageToDataUrl(file)
      setForm((prev) => ({ ...prev, image_url: dataUrl }))
      setFeedback({ type: '', text: '' })
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    }
  }

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Kosongkan form dan kembali ke mode "tambah"
  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Dipanggil saat tombol Simpan/Tambah ditekan
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.philosophy.trim() || !form.description.trim()) {
      setFeedback({ type: 'error', text: 'Nama motif, filosofi, dan deskripsi wajib diisi.' })
      return
    }

    setSubmitting(true)
    setFeedback({ type: '', text: '' })

    const payload = {
      name: form.name.trim(),
      region_id: form.region_id || null,
      category: form.category,
      occasion: form.occasion.trim() || 'Acara Resmi',
      philosophy: form.philosophy.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
    }

    try {
      if (editingId) {
        await updateMotif(editingId, payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil diperbarui.` })
      } else {
        await createMotif(payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil ditambahkan.` })
      }
      resetForm()
      motifsRes.retry()
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  // Tombol Edit: isi form dengan data motif yang dipilih
  const handleEdit = (motif) => {
    setEditingId(motif.id)
    setForm({
      name: motif.name || '',
      region_id: motif.region_id || motif.regions?.id || '',
      category: motif.category || 'Nusantara',
      occasion: motif.occasion || 'Acara Resmi',
      philosophy: motif.philosophy || '',
      description: motif.description || '',
      image_url: motif.image_url || '',
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFeedback({ type: '', text: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Tombol Hapus: minta konfirmasi dulu, lalu DELETE
  const handleDelete = async (motif) => {
    if (!window.confirm(`Hapus motif "${motif.name}" dari katalog?`)) return
    setFeedback({ type: '', text: '' })
    try {
      await deleteMotif(motif.id)
      if (editingId === motif.id) resetForm()
      setFeedback({ type: 'ok', text: `Motif "${motif.name}" telah dihapus.` })
      motifsRes.retry()
    } catch (err) {
      setFeedback({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="page">
      <h1>Profil &amp; Kelola Motif</h1>

      {/* ---------- Kartu profil pembuat ---------- */}
      <section className="panel">
        <h2>Pembuat</h2>
        <div className="profile-head">
          <div className="profile-avatar" aria-hidden="true">
            {PROFILE.nama.charAt(0)}
          </div>
          <div>
            <strong className="profile-name">{PROFILE.nama}</strong>
            <p className="muted">
              NIM {PROFILE.nim} · {PROFILE.kelas}
            </p>
          </div>
        </div>
        <dl className="spec spec-plain">
          <dt>Nama</dt>
          <dd>{PROFILE.nama}</dd>
          <dt>NIM</dt>
          <dd>{PROFILE.nim}</dd>
          <dt>Kelas</dt>
          <dd>{PROFILE.kelas}</dd>
          <dt>Repositori</dt>
          <dd>
            <a href={PROFILE.github} target="_blank" rel="noreferrer">
              github.com/cilfaa/wastraku ↗
            </a>
          </dd>
        </dl>
      </section>

      {/* ---------- Penjelasan aplikasi ---------- */}
      <section className="panel">
        <h2>Tentang WastraKu</h2>
        <p>
          <strong>WastraKu</strong> adalah ensiklopedia digital Batik Nusantara berbasis Progressive Web App (PWA) yang
          menghimpun motif batik autentik dari seluruh provinsi di Indonesia, lengkap dengan makna filosofis, sejarah
          budaya, simbolisme, dan penggunaan adatnya.
        </p>
        <p className="muted" style={{ marginTop: 10 }}>
          Aplikasi ini terhubung ke REST API (Node.js + Express + Supabase) dan dilengkapi fitur simpan motif favorit
          serta pengelolaan data motif (CRUD).
        </p>
      </section>

      {/* ---------- Form tambah / edit motif ---------- */}
      <section className="panel">
        <h2>{editingId ? 'Edit Motif Batik' : 'Tambah Motif Batik (CRUD)'}</h2>
        <form className="crud-form" onSubmit={handleSubmit}>
          <div className="crud-grid">
            <label className="crud-field">
              <span>Nama Motif</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Batik Sekar Jagad"
                required
              />
            </label>

            <label className="crud-field">
              <span>Provinsi Asal</span>
              <select name="region_id" value={form.region_id} onChange={handleChange}>
                <option value="">Pilih Provinsi (Opsional)</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.province} — {r.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="crud-field">
              <span>Kategori</span>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="crud-field">
              <span>Penggunaan Adat</span>
              <input
                name="occasion"
                value={form.occasion}
                onChange={handleChange}
                placeholder="Upacara Adat / Acara Resmi"
              />
            </label>
          </div>

          <label className="crud-field">
            <span>Makna &amp; Filosofi</span>
            <textarea
              name="philosophy"
              rows="2"
              value={form.philosophy}
              onChange={handleChange}
              placeholder="Tuliskan makna filosofis motif..."
              required
            />
          </label>

          <label className="crud-field">
            <span>Deskripsi Pola &amp; Ornamen</span>
            <textarea
              name="description"
              rows="2"
              value={form.description}
              onChange={handleChange}
              placeholder="Tuliskan ciri pola dan ornamen kain..."
              required
            />
          </label>

          {/* Unggah foto batik langsung dari perangkat */}
          <div className="crud-field">
            <span>Foto Kain Batik (Opsional)</span>
            <div className="crud-upload-box">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFile}
                aria-label="Pilih foto kain batik"
              />
              {form.image_url && (
                <div className="crud-preview-wrap">
                  <img src={form.image_url} alt="Pratinjau foto batik" className="crud-preview" />
                  <button type="button" className="chip crud-del" onClick={clearImage}>
                    Hapus Foto
                  </button>
                </div>
              )}
            </div>
          </div>

          {feedback.text && (
            <p className={feedback.type === 'error' ? 'crud-msg error' : 'crud-msg ok'} role="status">
              {feedback.text}
            </p>
          )}

          <div className="crud-actions">
            <button type="submit" className="btn crud-submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Motif'}
            </button>
            {editingId && (
              <button type="button" className="share-btn" onClick={resetForm}>
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ---------- Daftar motif (Read) ringkas dengan filter ---------- */}
      <section className="panel">
        <div className="list-head" style={{ marginTop: 0 }}>
          <h2>Kelola Data Motif ({filteredMotifs.length})</h2>
        </div>

        <div className="filter-bar">
          <SearchInput
            placeholder="Cari motif untuk diedit atau dihapus..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          <select
            className="province-select"
            value={filterProvince}
            onChange={(e) => setFilterProvince(e.target.value)}
            aria-label="Filter daftar motif berdasarkan provinsi"
          >
            <option value="Semua">Semua Provinsi</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {motifsRes.loading && <p className="muted" style={{ marginTop: 12 }}>Memuat daftar motif...</p>}
        {motifsRes.error && <p className="crud-msg error">{motifsRes.error}</p>}

        <ul className="crud-list">
          {visibleMotifs.map((m) => (
            <li key={m.id} className="crud-item">
              <div className="crud-item-info">
                <strong>{m.name}</strong>
                <span className="muted">
                  {m.regions?.province || 'Nusantara'} · {m.category}
                </span>
              </div>
              <div className="crud-item-btns">
                <button type="button" className="chip" onClick={() => handleEdit(m)}>
                  Edit
                </button>
                <button type="button" className="chip crud-del" onClick={() => handleDelete(m)}>
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>

        {!isFiltered && filteredMotifs.length > 5 && (
          <button
            type="button"
            className="share-btn crud-more-btn"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? 'Tampilkan lebih ringkas' : `Lihat semua (${filteredMotifs.length} motif)`}
          </button>
        )}
      </section>
    </div>
  )
}
