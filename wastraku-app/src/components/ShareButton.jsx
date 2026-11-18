// ============================================================
// ShareButton.jsx — tombol "Bagikan" untuk membagikan link halaman
// - Di HP: membuka menu bagikan bawaan (WhatsApp, Instagram, dll)
// - Di laptop: menyalin link ke clipboard
// ============================================================
import { useEffect, useState } from 'react'

// title = judul yang dibagikan, text = kalimat singkat pendamping
export default function ShareButton({ title, text }) {
  const [copied, setCopied] = useState(false) // true sesaat setelah link tersalin

  // Setelah 2 detik, tulisan "Tautan disalin" kembali menjadi "Bagikan"
  useEffect(() => {
    if (!copied) return undefined
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  const handleShare = async () => {
    const url = window.location.href // alamat halaman yang sedang dibuka

    // Cara 1: menu bagikan bawaan HP (Web Share API)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (err) {
        if (err?.name === 'AbortError') return // pengguna menutup menu, tidak apa-apa
      }
    }

    // Cara 2: salin link ke clipboard
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // Cara 3 (cadangan): tampilkan link agar bisa disalin manual
      window.prompt('Salin tautan berikut:', url)
    }
  }

  return (
    <button type="button" className="share-btn" onClick={handleShare} aria-label="Bagikan tautan halaman ini">
      {/* Ikon bagikan (tiga titik terhubung) */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <span>{copied ? 'Tautan disalin' : 'Bagikan'}</span>
    </button>
  )
}
