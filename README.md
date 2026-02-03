# AI Remove Image Background

Aplikasi web modern untuk menghapus background gambar secara otomatis menggunakan AI. Dibangun dengan [Next.js](https://nextjs.org), Tailwind CSS, dan Framer Motion.

## Fitur Utama

-   **Background Removal**: Hapus background instan dengan presisi tinggi.
-   **AI Processing**: Integrasi dengan remove.bg API.
-   **Modern UI**: Antarmuka pengguna yang responsif, bersih, dan interaktif dengan animasi halus.
-   **Privacy Focused**: Pemrosesan aman dan cepat.

## Persiapan (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda.

### 1. Clone Repository

```bash
git clone https://github.com/GodwinHalleyWattimena/AI-RM-Image-Bg.git
cd AI-RM-Image-Bg
```

### 2. Install Dependencies

Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/) (versi 18 atau terbaru direkomendasikan).

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 3. Konfigurasi Environment Variables

Aplikasi ini membutuhkan API Key dari remove.bg.

1.  Buat file bernama `.env.local` di root folder proyek.
2.  Tambahkan konfigurasi berikut ke dalamnya:

```env
# Dapatkan API Key gratis di https://www.remove.bg/dashboard#api-key
REMOVE_BG_API_KEY=your_api_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Catatan**: Ganti `your_api_key_here` dengan API Key yang Anda dapatkan dari dashboard remove.bg.

### 4. Jalankan Aplikasi

Jalankan development server:

```bash
npm run dev
# atay
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

## Teknologi yang Digunakan

-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS v4
-   **Icons**: Lucide React
-   **Animation**: Framer Motion
-   **File Handling**: React Dropzone

## Deploy

Cara termudah untuk men-deploy aplikasi ini adalah menggunakan [Vercel](https://vercel.com/new). Pastikan Anda menambahkan Environment Variables (`REMOVE_BG_API_KEY`) di dashboard Vercel saat deployment.
