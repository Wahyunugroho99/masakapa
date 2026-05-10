# MasakApa - Asisten AI Anti-Boros Makanan

MasakApa adalah aplikasi asisten memasak berbasis AI yang membantu pengguna di Indonesia mengurangi pemborosan makanan dengan merekomendasikan resep berdasarkan bahan yang sudah tersedia di rumah.

## Fitur Utama
- **AI Recipe Generator**: Mengubah bahan sisa menjadi menu lezat & bergizi.
- **Mode Kulkas Darurat**: Prioritaskan bahan yang hampir kedaluwarsa.
- **Mode Anak Kos**: Resep murah (Rp20rb) & alat masak terbatas (Rice Cooker/Wajan).
- **Estimasi Nilai Gizi**: Kalori, protein, dan saran keseimbangan porsi.
- **Smart Shopping List**: Belanja minimal hanya untuk bahan yang benar-benar perlu.
- **Kalkulator Hemat**: Pantau penghematan harian, mingguan, dan bulanan.

## Cara Menjalankan Lokal

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Set Environment Variable**:
   Buat file `.env` (atau set di environment):
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

## Build & Production

1. **Build**:
   ```bash
   npm run build
   ```

2. **Start**:
   ```bash
   npm start
   ```

## Build Android APK/AAB (Capacitor + GitHub Actions)

Project ini sudah disiapkan untuk Android dengan Capacitor.

### Script lokal

```bash
# Build web (output ke dist/)
npm run build:web

# Build web + sync ke project android/
npm run android:sync

# Opsional, buka project Android Studio
npm run android:open
```

### Build cloud (recommended untuk laptop low-end)

Workflow: `.github/workflows/android-build.yml`

Workflow akan:
1. Install dependency (`npm ci`)
2. Build web + sync Capacitor (`npm run android:sync`)
3. Build `APK` dan `AAB` (`./gradlew assembleRelease bundleRelease`)
4. Upload artifact hasil build

### Secrets untuk signing release

Tambahkan secrets repository berikut agar workflow otomatis sign release:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD` (opsional; jika kosong akan pakai `ANDROID_KEYSTORE_PASSWORD`)

Contoh encode keystore ke base64:

```bash
openssl base64 < masakapa-release.jks | tr -d '\n'
```

Jika secrets belum diisi, workflow tetap build artifact Android, tapi hasilnya belum signed untuk rilis publik.

## Deploy ke Google Cloud Run

1. Build image:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT-ID]/masak-apa
   ```

2. Deploy:
   ```bash
   gcloud run deploy masak-apa --image gcr.io/[PROJECT-ID]/masak-apa --platform managed --allow-unauthenticated
   ```

---
Dibangun untuk demo dengan Google AI Studio + Gemini API.
