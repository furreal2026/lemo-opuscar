# Default untuk konten kanal "What if" / fun facts

Dibuat 2026-11-19 dari keputusan pengguna pada film "What if you didn't sleep for three days?".
Berlaku untuk semua konten berikutnya, termasuk kode dan obrolan baru, kecuali pengguna mengubahnya secara tertulis.

## Format
- Rasio 9:16 (1080x1920), 30 fps.
- Bahasa narasi: Inggris.
- Target durasi: sekitar 60-75 detik per video.

## Gaya visual
- Gaya: Mid-century Cartoon (lemo-opuscar, `styles/midcentury-toon`).
- Tokoh utama: kepala bulat, badan tegak, sarung tangan kartun 4 jari, rambut cokelat pendek.
  Tokoh lain boleh berubah sesuai cerita, tetapi tokoh utama tetap sama di setiap video.
- Lingkungan boleh lebih detail dari aturan bawaan gaya, tetap datar dan bergaya cetak.
- Gerakan kamera 3D dengan Remotion: lapisan (multiplane) dengan dorong, geser, dan sedikit putar.
- Bukan gaya B4 dan bukan gambar hasil kode yang meniru B4. Gaya B4 hanya bisa dibuat dengan AI pembuat gambar.

## Suara
- Narator: ElevenLabs "Mike - Animation Explainers, Gaming" (file v4, stabilitas 50, kemiripan 75).
  Suara cepat, jelas, laki-laki, agak tinggi. Bukan suara berat seperti Brian.
- Narasi dibacakan satu narator untuk semua peran, termasuk ucapan teman dan ibu.
- Setiap rekaman dicocokkan per kata (faster-whisper small, sumber model npm @skillninja/shortmovie-telop-model).

## Subtitle
- Putih, satu baris, maksimal 3 kata per tampilan.
- Posisi agak naik (sekitar 74% tinggi layar), bukan di tepi bawah.
- Dipotong per makna dan mengikuti jeda bicara, bukan jumlah kata tetap.

## Musik dan efek suara
- Musik latar: pustaka lemo-opuscar/audio library (contoh: "BossaBossa", Kevin MacLeod, CC BY 4.0).
  Wajib cantumkan kredit saat diunggah.
- Efek suara: dari pustaka (Kenney, CC0, dan lainnya) atau dibuat dengan kode.
- Musik turun sekitar 8 dB saat ada narasi.
- Target loudness: -14 LUFS, puncak maksimal -1,2 dBTP.

## Aturan produksi
- Jangan memakai layanan gambar Gemini. Pengguna melarangnya.
- Gambar dan animasi dibuat di proyek lokal, di folder `films/<nama>/`.
- Sebelum render penuh, periksa cuplikan setiap shot dan dengarkan suaranya.
- Setiap render penuh harus didecode dan dicek ulang.

## Yang sudah ditolak pengguna
- Gambar tokoh yang digambar dengan kode dan dianggap "mirip B4". Pengguna memilih gaya lemo-opuscar.

## Catatan kategori kanal
- Gaya: Cartoons (kartun), gaya Mid-century Cartoon.
- YouTube: Education atau Entertainment, tergantung pendekatan konten.
