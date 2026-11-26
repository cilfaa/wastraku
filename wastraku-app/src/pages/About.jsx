// ============================================================
// About.jsx — halaman Profil + CRUD motif batik
// - Bagian atas: profil pembuat
// - Bagian tengah: form Tambah / Edit motif (Create & Update)
// - Bagian bawah: daftar motif dengan tombol Edit & Hapus (Read & Delete)
// ============================================================
import { useEffect, useState } from 'react'
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

export default function About() {
  // Ambil daftar motif dan provinsi dari API
  const motifsRes = useFetch(getMotifs, '/api/motifs')
  const regionsRes = useFetch(getRegions, '/api/regions')

  // State = data yang berubah-ubah di layar
  const [form, setForm] = useState(EMPTY_FORM)         // isi form saat ini
  const [editingId, setEditingId] = useState(null)     // id motif yang sedang diedit (null = mode tambah)
  const [filterText, setFilterText] = useState('')     // kata kunci pencarian di daftar
  const [submitting, setSubmitting] = useState(false)  // true saat sedang mengirim ke server
  const [feedback, setFeedback] = useState({ type: '', text: '' }) // pesan sukses / error

  useEffect(() => {
    document.title = 'Profil & Kelola Data · WastraKu'
  }, [])

  const regions = regionsRes.data || []
  const motifs = motifsRes.data || []

  // Menyaring daftar motif sesuai kata kunci pencarian
  const filteredMotifs = motifs.filter((m) => {
    const q = filterText.trim().toLowerCase()
    if (!q) return true
    return [m.name, m.category, m.regions?.province, m.regions?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q)
  })

  // Dipanggil setiap pengguna mengetik di kolom form: simpan ke state `form`
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Kosongkan form dan kembali ke mode "tambah"
  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  // Dipanggil saat tombol Simpan/Tambah ditekan
  const handleSubmit = async (e) => {
    e.preventDefault() // cegah halaman reload bawaan form
    // Validasi: tiga kolom ini wajib diisi
    if (!form.name.trim() || !form.philosophy.trim() || !form.description.trim()) {
      setFeedback({ type: 'error', text: 'Nama motif, filosofi, dan deskripsi wajib diisi.' })
      return
    }

    setSubmitting(true)
    setFeedback({ type: '', text: '' })

    // Data yang akan dikirim ke API (spasi di awal/akhir dibuang dengan trim)
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
        // Mode edit -> UPDATE
        await updateMotif(editingId, payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil diperbarui.` })
      } else {
        // Mode tambah -> CREATE
        await createMotif(payload)
        setFeedback({ type: 'ok', text: `Motif "${payload.name}" berhasil ditambahkan.` })
      }
      resetForm()
      motifsRes.retry() // ambil ulang daftar supaya perubahan langsung terlihat
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
    setFeedback({ type: '', text: '' })
    window.scrollTo({ top: 0, behavior: 'smooth' }) // gulir ke atas agar form terlihat
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
          {/* Avatar: huruf pertama nama */}
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
          menghimpun motif batik autentik dari 38 provinsi di Indonesia, lengkap dengan makna filosofis, sejarah budaya,
          simbolisme, dan penggunaan adatnya.
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

            {/* Dropdown provinsi: pilihannya diambil dari data API */}
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

          <label className="crud-field">
            <span>URL Gambar Batik (Opsional)</span>
            <input
              name="image_url"
              type="url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://commons.wikimedia.org/..."
            />
          </label>

          {/* Pesan sukses (hijau) atau error (merah) */}
          {feedback.text && (
            <p className={feedback.type === 'error' ? 'crud-msg error' : 'crud-msg ok'} role="status">
              {feedback.text}
            </p>
          )}

          <div className="crud-actions">
            <button type="submit" className="btn crud-submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Motif'}
            </button>
            {/* Tombol Batal hanya muncul saat mode edit */}
            {editingId && (
              <button type="button" className="share-btn" onClick={resetForm}>
                Batal Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ---------- Daftar motif (Read) dengan Edit & Hapus ---------- */}
      <section className="panel">
        <div className="list-head" style={{ marginTop: 0 }}>
          <h2>Daftar Data Motif ({motifs.length})</h2>
        </div>
        <SearchInput
          placeholder="Cari motif untuk diedit atau dihapus..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          style={{ marginTop: 10 }}
        />

        {motifsRes.loading && <p className="muted" style={{ marginTop: 12 }}>Memuat daftar motif...</p>}
        {motifsRes.error && <p className="crud-msg error">{motifsRes.error}</p>}

        <ul className="crud-list">
          {filteredMotifs.map((m) => (
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
      </section>
    </div>
  )
}
