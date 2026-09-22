# KawanIT — Chatbot Pendidikan IT

KawanIT adalah chatbot tutor IT berbahasa Indonesia untuk tugas kuliah. Pengguna memilih bidang belajar, mengirim pertanyaan lewat halaman web, lalu backend Node.js meminta jawaban dari Gemini API. API key hanya dibaca oleh server.

## Fitur

- Topik: Web Development, Networking, Android/Kotlin, Database, dan Cybersecurity.
- Gaya jawaban ramah pemula, dengan contoh sederhana dan latihan bila sesuai.
- Riwayat percakapan per sesi browser (12 pesan terakhir) agar pertanyaan lanjutan tetap punya konteks.
- Tombol untuk memulai percakapan baru, contoh pertanyaan, dan tampilan yang menyesuaikan layar ponsel.
- Pemeriksaan input, batas panjang pesan, dan penanganan kesalahan API.

## Teknologi

Node.js 20+, Express, JavaScript/HTML/CSS, SDK resmi `@google/genai`, dan Gemini API.

## Struktur proyek

```text
it-tutor-chatbot/
├── public/
│   ├── app.js          # Interaksi halaman chat
│   ├── index.html       # Tampilan
│   └── style.css        # Desain responsif
├── .env.example         # Contoh konfigurasi
├── .gitignore           # Melindungi .env dan node_modules
├── package.json
├── server.js            # Endpoint dan integrasi Gemini
└── README.md
```

## Cara menjalankan

1. Instal [Node.js](https://nodejs.org/) versi 20 atau lebih baru.
2. Buat API key melalui [Google AI Studio](https://aistudio.google.com/apikey). Simpan key pribadi; jangan masukkan ke source code atau screenshot.
3. Buka terminal di folder `it-tutor-chatbot`, lalu jalankan:

   ```bash
   npm install
   ```

4. Salin `.env.example` menjadi `.env`, lalu ganti `isi_api_key_anda_di_sini` dengan API key Anda. `GEMINI_MODEL` dapat diganti jika model tersebut tidak tersedia untuk key Anda. Nama model bawaan adalah `gemini-3.6-flash`.
5. Jalankan:

   ```bash
   npm start
   ```

6. Buka [http://localhost:3000](http://localhost:3000). Pilih topik dan kirim pertanyaan. Untuk pengembangan, gunakan `npm run dev` agar server mulai ulang saat file diubah.

Untuk memeriksa sintaks JavaScript, jalankan `npm run check`.

> Setiap perubahan `.env` baru dibaca ketika server dimulai. Setelah mengisi atau mengganti API key/model, hentikan server dengan Ctrl+C, jalankan lagi `npm start`, lalu muat ulang halaman browser. Jika permintaan gagal, periksa pesan kesalahan, koneksi, kuota Gemini, dan apakah model tersedia untuk API key Anda.

## Cara kerja

1. Browser mengirim `message` dan `topic` ke `POST /api/chat`.
2. Server memvalidasi input, menambahkan system prompt tutor IT, serta menyertakan riwayat sesi.
3. Server memanggil Gemini dan mengirim teks jawaban ke browser.
4. Sesi dikenali oleh cookie acak `HttpOnly`. Riwayat hanya ada di memori proses server selama maksimal satu jam tanpa aktivitas. Riwayat hilang saat server dimulai ulang; aplikasi ini tidak memakai database.

Endpoint lain: `GET /api/status` untuk status konfigurasi, `GET /api/history` untuk riwayat sesi, dan `DELETE /api/history` untuk menghapusnya.

## Parameter kreatif

| Parameter | Konfigurasi |
| --- | --- |
| Bahasa dan gaya | Bahasa Indonesia, ramah, bertahap untuk pemula |
| Domain | Lima topik IT yang dipilih pengguna |
| Model | `GEMINI_MODEL` di `.env` (bawaan `gemini-3.6-flash`) |
| Variasi jawaban | `temperature: 0.6` di `server.js` |
| Panjang jawaban | `maxOutputTokens: 1024` di `server.js` |
| Memory | 12 pesan terakhir per sesi, sementara di server |

## Mengunggah ke GitHub

1. Pastikan `.env` **tidak** ikut diunggah. File `.gitignore` sudah mengecualikannya. Jangan unggah `node_modules`.
2. Buat repositori kosong di GitHub, misalnya `kawanit-chatbot`.
3. Jalankan di folder proyek (ganti URL dengan URL repositori Anda):

   ```bash
   git init
   git add .
   git status
   git commit -m "Buat chatbot pendidikan IT"
   git branch -M main
   git remote add origin https://github.com/USERNAME/kawanit-chatbot.git
   git push -u origin main
   ```

4. Salin URL repositori dari browser untuk dikumpulkan. Jika `git status` memperlihatkan `.env`, hentikan dan perbaiki `.gitignore` sebelum commit.

## Screenshot untuk tugas

Ambil screenshot setelah aplikasi berjalan dengan API key Anda:

1. **Halaman awal:** logo KawanIT, pilihan lima topik, dan contoh pertanyaan.
2. **Percakapan Web Development:** satu pertanyaan dan jawaban Gemini yang relevan.
3. **Topik lain:** misalnya Database atau Networking, untuk menunjukkan pilihan topik bekerja.
4. **Memory percakapan:** pertanyaan lanjutan yang merujuk jawaban sebelumnya, atau halaman yang dimuat ulang tetapi chat masih tampil.
5. **Tampilan ponsel** (opsional): gunakan mode perangkat di browser.

Simpan gambar sebagai PNG/JPG. Pastikan screenshot tidak memperlihatkan file `.env`, API key, atau data pribadi. Kumpulkan URL GitHub dan screenshot sesuai format yang diminta dosen.

## Catatan

Aplikasi ini contoh pembelajaran lokal. Penyimpanan sesi di memori cocok untuk demo satu server. Untuk deployment publik yang lebih besar, tambahkan penyimpanan sesi permanen dan pembatasan permintaan yang lebih lengkap.

Referensi integrasi: [Dokumentasi Gemini API](https://ai.google.dev/gemini-api/docs) dan [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai).
