// Membuat ikon PNG sederhana (tanpa library) -> public/icon-192.png & icon-512.png
import fs from 'node:fs'
import zlib from 'node:zlib'

function crc32(buf) {
  let c, crc = ~0
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    crc = (crc >>> 8) ^ c
  }
  return ~crc >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}
function makePng(size) {
  const bg = [15, 17, 21], keyc = [245, 166, 35], keyTop = [255, 200, 87]
  const raw = Buffer.alloc((size * 3 + 1) * size)
  const m = size * 0.18, r = size * 0.14
  const inRound = (x, y, x0, y0, x1, y1, rad) => {
    if (x < x0 || x > x1 || y < y0 || y > y1) return false
    const cx = Math.min(Math.max(x, x0 + rad), x1 - rad)
    const cy = Math.min(Math.max(y, y0 + rad), y1 - rad)
    return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad
  }
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0
    for (let x = 0; x < size; x++) {
      let col = bg
      if (inRound(x, y, m, m, size - m, size - m, r)) col = keyc
      if (inRound(x, y, m * 1.4, m * 1.2, size - m * 1.4, size - m * 1.9, r * 0.8)) col = keyTop
      const i = y * (size * 3 + 1) + 1 + x * 3
      raw[i] = col[0]; raw[i + 1] = col[1]; raw[i + 2] = col[2]
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 2
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}
fs.mkdirSync('public', { recursive: true })
fs.writeFileSync('public/icon-192.png', makePng(192))
fs.writeFileSync('public/icon-512.png', makePng(512))
console.log('Ikon dibuat di folder public/')
