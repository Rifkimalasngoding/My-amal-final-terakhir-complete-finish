# Muthaba'ah Amal Yaumi & Doa Tracker

**A beautiful daily Islamic deeds tracker with reset system and comprehensive offline-first prayers library.**

Aplikasi ini membantu Muslim untuk mengevaluasi dan melacak ibadah harian (amal yaumi) dengan sistem reset otomatis, serta menyediakan perpustakaan doa lengkap untuk mendukung kehidupan spiritual sehari-hari.

## 🌙 Fitur Utama

- **📋 Amal Yaumi Tracker**: Lacak amalan ibadah harian Anda dengan interface yang intuitif dan cantik
- **🔄 Sistem Reset Otomatis**: Data reset setiap tengah malam waktu lokal untuk evaluasi harian yang terstruktur
- **📖 Pustaka Doa Lengkap**: Koleksi doa-doa Islam yang komprehensif dan tersusun rapi
- **💾 Offline First**: Aplikasi bekerja sepenuhnya offline dengan data tersimpan lokal
- **🎨 Design Modern**: UI yang responsif dengan animasi smooth menggunakan Tailwind CSS dan Motion
- **📱 Mobile Friendly**: Dioptimalkan untuk perangkat mobile dan desktop

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Motion (Framer Motion)** - Smooth animations
- **Lucide React** - Beautiful icon set

### Backend & API
- **Express.js** - API server
- **Google Gemini API** - AI-powered features
- **jsPDF** - PDF generation

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **TypeScript Compiler** - Type checking

## 📦 Prerequisites

Pastikan Anda memiliki:
- **Node.js** (v16 atau lebih baru)
- **npm** (v8 atau lebih baru)
- **Google Gemini API Key** (gratis dari [ai.google.dev](https://ai.google.dev))

## 🚀 Quickstart

### 1. Clone Repository
```bash
git clone https://github.com/Rifkimalasngoding/My-amal-final-terakhir-complete-finish.git
cd My-amal-final-terakhir-complete-finish
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory:
```bash
cp .env.example .env.local
```

Edit `.env.local` dan tambahkan Gemini API Key Anda:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
APP_URL="http://localhost:3000"
```

### 4. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📖 Available Commands

```bash
# Development - Hot reload di port 3000
npm run dev

# Production Build
npm run build

# Preview build hasil
npm run preview

# Type checking
npm run lint

# Clean build artifacts
npm run clean
```

## 📁 Project Structure

```
My-amal-final-terakhir-complete-finish/
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/          # React components
│   │   ├── AmalTracker.tsx  # Amal tracker interface
│   │   └── DoaLibrary.tsx   # Prayer library
│   └── ...
├── public/
│   └── index.html           # Entry point HTML
├── index.html               # Vite entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
├── package.json             # Dependencies & scripts
└── metadata.json            # App metadata (AI Studio)
```

## 🎯 Penggunaan

### Tab Amal Yaumi
- Lihat daftar amalan ibadah harian
- Tandai amalan yang sudah dilakukan
- Data akan direset otomatis setiap tengah malam
- Pantau progres ibadah Anda

### Tab Pustaka Doa
- Jelajahi koleksi doa-doa Islam lengkap
- Cari doa berdasarkan kategori atau keyword
- Baca transliterasi dan terjemahan
- Manfaatkan AI untuk bantuan membaca dan memahami doa

## 🔧 Konfigurasi

### Vite Config
- React plugin untuk JSX transform
- Tailwind CSS integration
- Path alias `@` untuk imports yang lebih clean
- HMR configuration untuk development

### TypeScript
- Strict mode enabled
- Target: ES2020
- JSX: react-jsx

## 📝 Environment Variables

| Variable | Deskripsi | Required |
|----------|-----------|----------|
| `GEMINI_API_KEY` | API key untuk Google Gemini | ✅ |
| `APP_URL` | URL aplikasi untuk self-referential links | ✅ |

## 🌐 Deployment

Aplikasi ini dapat dideploy ke:
- **AI Studio** (Recommended - original template)
- **Vercel** - untuk frontend
- **Google Cloud Run** - untuk full stack

### Deploy ke Vercel
```bash
npm run build
vercel deploy
```

## 📄 License

Belum ditentukan. Silakan tambahkan LICENSE file sesuai kebutuhan.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 🐛 Bug Report & Feature Request

Jika menemukan bug atau ingin mengusulkan fitur baru, silakan buat issue di GitHub.

## ✨ Inspirasi

Aplikasi ini dibangun dengan spirit dari ayat-ayat Al-Quran dan Hadis yang mendorong kita untuk terus istiqamah dalam beramal:

> "Maka berlomba-lombalah kamu dalam kebaikan." — QS. Al-Baqarah: 148

> "Amalan yang paling dicintai oleh Allah adalah amalan yang kontinu (istiqamah) walaupun sedikit." — HR. Bukhari

---

**Dibuat dengan ❤️ untuk membantu Muslim mendekatkan diri kepada Allah melalui amalan dan doa sehari-hari.**
