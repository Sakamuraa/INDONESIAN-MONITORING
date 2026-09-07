# 🌋 INDONESIAN MONITORING

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.9-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.11-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre%20GL-6.7.0-31C3DD?logo=openstreetmap&logoColor=white)](https://maplibre.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/sannnproject/INDONESIAN-MONITORING?style=social)](https://github.com/sannnproject/INDONESIAN-MONITORING)

**Platform Open Source untuk Memantau Bencana Alam di Indonesia dalam Satu Dashboard Terintegrasi**

[Fitur](#-fitur) • [Quick Start](#-quick-start) • [Arsitektur](#-arsitektur) • [Kontribusi](#-kontribusi) • [Lisensi](#-lisensi)

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#-fitur)
- [Tech Stack](#-tech-stack)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Quick Start](#-quick-start)
- [Struktur Proyek](#-struktur-proyek)
- [Arsitektur Sistem](#-arsitektur)
- [Cara Kerja](#-cara-kerja)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [API Integration](#-api-integration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Proyek

**INDONESIAN MONITORING** adalah platform web open source yang dirancang khusus untuk memantau dan melacak kejadian bencana alam di Indonesia secara real-time. Platform ini mengintegrasikan berbagai sumber data bencana dan menyajikannya dalam satu dashboard yang mudah digunakan.

### 🎯 Visi
Menjadi platform monitoring bencana alam nomor satu di Indonesia yang dapat diakses oleh publik, pemerintah, dan lembaga kemanusiaan untuk respons cepat dan mitigasi bencana yang efektif.

### 🚀 Misi
- Menyediakan informasi real-time tentang bencana alam di Indonesia
- Mengintegrasikan multiple data sources untuk akurasi maksimal
- Memudahkan masyarakat dan institusi dalam monitoring bencana
- Mendukung pengambilan keputusan cepat untuk respons bencana

---

## ✨ Fitur

### Core Features
- 🗺️ **Real-time Map Visualization** - Visualisasi peta interaktif menggunakan MapLibre GL untuk menampilkan lokasi bencana
- 📊 **Dashboard Analytics** - Analitik komprehensif dan statistik bencana dengan grafik interaktif
- 🔔 **Alert System** - Sistem notifikasi real-time untuk bencana yang terdeteksi
- 📱 **Responsive Design** - Fully responsive dan mobile-friendly interface
- ⚡ **High Performance** - Loading cepat dengan Next.js optimization
- 🎨 **Modern UI/UX** - Interface modern dengan Tailwind CSS dan animasi smooth
- 🔍 **Advanced Search & Filter** - Pencarian dan filtering bencana berdasarkan tipe, lokasi, dan waktu

### Advanced Features
- 📈 **Historical Data Analysis** - Analisis data historis bencana dengan trend analysis
- 🌐 **Multi-source Integration** - Integrasi dengan berbagai sumber data bencana
- 🔐 **Secure Architecture** - Implementasi security best practices
- ♿ **Accessibility** - Compliance dengan WCAG standards
- 🌙 **Dark Mode Support** - Support untuk dark mode theme

---

## 🛠️ Tech Stack

### Frontend Framework & UI
| Technology | Version | Fungsi |
|-----------|---------|---------|
| **Next.js** | 15.4.9 | React framework untuk production-ready web application |
| **React** | 19.2.1 | UI library untuk component-based architecture |
| **TypeScript** | 5.9.3 | Type-safe JavaScript untuk development yang lebih robust |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework untuk styling yang cepat |

### Maps & Visualization
| Technology | Version | Fungsi |
|-----------|---------|---------|
| **MapLibre GL** | 6.7.0 | Open-source mapping library untuk visualisasi peta interaktif |
| **Lucide React** | 0.553.0 | Icon library dengan 400+ ikon untuk UI enhancement |

### State Management & Forms
| Technology | Version | Fungsi |
|-----------|---------|---------|
| **React Hook Form** | 5.2.1 | Performant form management dengan minimal re-renders |
| **Class Variance Authority** | 0.7.1 | Type-safe component variants management |

### Animation & UX
| Technology | Version | Fungsi |
|-----------|---------|---------|
| **Motion** | 12.23.24 | Animation library untuk smooth transitions dan effects |
| **TW Animate CSS** | 1.4.0 | Advanced animation utilities untuk Tailwind CSS |

### Build & Development Tools
| Technology | Version | Fungsi |
|-----------|---------|---------|
| **ESLint** | 9.39.1 | Code linting untuk maintain code quality |
| **PostCSS** | 8.5.6 | CSS transformation dan optimization |
| **Autoprefixer** | 10.4.21 | Automatic CSS vendor prefixes |
| **Firebase Tools** | 15.0.0 | Deployment dan hosting tools |

---

## 💻 Persyaratan Sistem

### Minimum Requirements
- **Node.js**: v18.0.0 atau lebih tinggi
- **npm**: v9.0.0 atau lebih tinggi (atau yarn/pnpm)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB untuk development setup

### Development Environment
- **OS**: macOS, Linux, atau Windows (WSL2)
- **Code Editor**: VS Code, WebStorm, atau Vim
- **Git**: v2.0.0 atau lebih tinggi
- **Browser**: Chrome, Firefox, Safari, atau Edge (versi terbaru)

---

## 🚀 Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/sannnproject/INDONESIAN-MONITORING.git
cd INDONESIAN-MONITORING
```

### 2️⃣ Install Dependencies
```bash
npm install
# atau menggunakan yarn
yarn install
# atau menggunakan pnpm
pnpm install
```

### 3️⃣ Environment Setup
Buat file `.env.local` di root directory:
```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_DISASTER_API_URL=https://api.disaster-monitoring.id

# Map Config
NEXT_PUBLIC_MAPLIBRE_API_KEY=your_maplibre_api_key_here

# Environment
NEXT_PUBLIC_ENV=development
```

### 4️⃣ Run Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### 5️⃣ Build untuk Production
```bash
npm run build
npm run start
```

---

## 📁 Struktur Proyek

```
INDONESIAN-MONITORING/
├── 📂 app/                          # Next.js App Directory
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 disasters/            # Disaster data endpoints
│   │   └── 📂 analytics/            # Analytics endpoints
│   ├── 📂 components/               # React Components
│   │   ├── 📂 map/                  # Map-related components
│   │   ├── 📂 dashboard/            # Dashboard components
│   │   ├── 📂 analytics/            # Analytics components
│   │   ├── 📂 ui/                   # Reusable UI components
│   │   └── 📂 layouts/              # Layout components
│   ├── 📂 lib/                      # Utility functions
│   │   ├── api.ts                   # API client setup
│   │   ├── constants.ts             # Constants & config
│   │   └── utils.ts                 # Helper functions
│   ├── 📂 styles/                   # Global styles
│   │   └── globals.css              # Tailwind directives
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page
│   └── error.tsx                    # Error boundary
├── 📂 public/                       # Static assets
│   ├── 📂 images/                   # Image files
│   ├── 📂 icons/                    # Icon files
│   └── robots.txt                   # SEO meta
├── 📂 types/                        # TypeScript type definitions
│   ├── disaster.ts                  # Disaster types
│   ├── analytics.ts                 # Analytics types
│   └── common.ts                    # Common types
├── 📂 hooks/                        # React Custom Hooks
│   ├── useDisasters.ts              # Disaster data hook
│   ├── useAnalytics.ts              # Analytics hook
│   └── useMap.ts                    # Map interaction hook
├── 📂 context/                      # React Context
│   ├── DisasterContext.tsx          # Disaster data context
│   └── ThemeContext.tsx             # Theme context
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 next.config.ts                # Next.js configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 .eslintrc.json                # ESLint configuration
├── 📄 .env.local                    # Environment variables (local)
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Project documentation
└── 📄 LICENSE                       # License file
```

### 📝 Penjelasan Struktur

| Direktori | Deskripsi |
|-----------|-----------|
| `app/` | Next.js 13+ app directory dengan file-based routing |
| `app/api/` | Server-side API routes untuk backend logic |
| `app/components/` | Reusable React components terstruktur per feature |
| `app/lib/` | Utility functions, API clients, dan helpers |
| `types/` | TypeScript interfaces dan type definitions |
| `hooks/` | Custom React hooks untuk logic reusable |
| `context/` | React Context untuk state management global |
| `public/` | Static assets yang di-serve as-is |

---

## 🏗️ Arsitektur

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Browser)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components + Next.js Routing + UI Rendering   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Next.js Server / API Routes / Middleware           │   │
│  │  ├── Form Validation (React Hook Form)              │   │
│  │  ├── State Management (Context + Hooks)             │   │
│  │  └── Data Fetching & Caching                        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATA & SERVICES LAYER                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  External APIs & Data Sources                        │   │
│  │  ├── Disaster Monitoring APIs                        │   │
│  │  ├── Weather & Geological Services                   │   │
│  │  └── MapLibre Tile Servers                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Layers

#### 1. **Presentation Layer**
- React 19 components untuk UI
- Tailwind CSS untuk styling
- Motion & animations untuk UX enhancement
- Responsive design untuk semua devices

#### 2. **Business Logic Layer**
- Next.js API routes untuk backend logic
- Custom React Hooks untuk state management
- React Context untuk global state
- React Hook Form untuk form management

#### 3. **Data Access Layer**
- MapLibre GL untuk geospatial data
- External disaster monitoring APIs
- Environment-based configuration

---

## ⚙️ Cara Kerja

### 1. **Data Flow**
```
User Interaction
      ↓
React Component (UI)
      ↓
Custom Hook (useDisasters, useAnalytics)
      ↓
API Route (/api/disasters, /api/analytics)
      ↓
External Data Source (Disaster APIs)
      ↓
Response & State Update
      ↓
Re-render & Display
```

### 2. **Map Visualization Process**
1. User membuka dashboard → komponen Map ditampilkan
2. Hook `useMap` fetch data lokasi disaster
3. MapLibre GL render map dengan GeoJSON layers
4. User interact dengan map → trigger analytics
5. Results ditampilkan dalam cards & charts

### 3. **Real-time Updates**
- WebSocket connection untuk live data
- Server-Sent Events (SSE) untuk notifications
- Optimistic UI updates dengan React state
- Cache strategy untuk performance

---

## 🔧 Konfigurasi Environment

### Development (.env.local)
```env
# API Endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_DISASTER_API_URL=https://api.example.com

# Map Config
NEXT_PUBLIC_MAPLIBRE_API_KEY=pk...
NEXT_PUBLIC_MAP_INITIAL_LAT=-2.5489
NEXT_PUBLIC_MAP_INITIAL_LNG=113.9213
NEXT_PUBLIC_MAP_INITIAL_ZOOM=4

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Environment
NEXT_PUBLIC_ENV=development
NODE_ENV=development
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.indonesian-monitoring.id
NEXT_PUBLIC_DISASTER_API_URL=https://api.production.disaster.id
NEXT_PUBLIC_ENV=production
NODE_ENV=production
```

### Environment Variables Reference

| Variable | Type | Deskripsi |
|----------|------|-----------|
| `NEXT_PUBLIC_MAPLIBRE_API_KEY` | string | API key untuk MapLibre GL |
| `NEXT_PUBLIC_API_BASE_URL` | string | Base URL untuk internal API |
| `NEXT_PUBLIC_DISASTER_API_URL` | string | URL untuk disaster monitoring API |
| `NEXT_PUBLIC_ENV` | enum | Environment (development/production) |

---

## 🔌 API Integration

### External APIs

#### 1. **MapLibre GL Integration**
```typescript
// Inisialisasi map
const map = new maplibregl.Map({
  container: 'map-container',
  style: 'https://demotiles.maplibre.org/style.json',
  center: [113.9213, -2.5489],
  zoom: 4
});
```

#### 2. **Disaster Data APIs**
```typescript
// Fetch disaster data
const disasters = await fetch(
  `${process.env.NEXT_PUBLIC_DISASTER_API_URL}/disasters`
).then(res => res.json());
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server dengan hot reload
npm run dev

# Build untuk production
npm run build

# Start production server
npm start

# Lint code menggunakan ESLint
npm run lint

# Clean Next.js cache
npm run clean
```

### Code Quality

```bash
# Format code (setup prettier optional)
npm run format

# Run type checking
tsc --noEmit

# Lint dan fix
npm run lint -- --fix
```

### Development Best Practices

1. **TypeScript**: Selalu gunakan type definitions
2. **Components**: Buat components yang small dan reusable
3. **Hooks**: Gunakan custom hooks untuk logic yang kompleks
4. **Styling**: Gunakan Tailwind CSS utilities
5. **Performance**: Optimize images dan implement lazy loading
6. **Testing**: Tambahkan unit tests untuk critical functions

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push dan create Pull Request
git push origin feature/amazing-feature
```

---

## 🚀 Deployment

### Deploy ke Vercel (Recommended)

1. **Push ke GitHub**
   ```bash
   git push origin main
   ```

2. **Connect ke Vercel**
   - Login ke [vercel.com](https://vercel.com)
   - Import repository
   - Tambahkan environment variables

3. **Auto Deploy**
   - Setiap push ke `main` → auto deploy
   - Preview deployment untuk setiap PR

### Deploy ke Firebase

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy
firebase deploy
```

### Deploy ke Docker

```bash
# Build Docker image
docker build -t indonesian-monitoring .

# Run container
docker run -p 3000:3000 indonesian-monitoring
```

### Environment Variables di Production
Pastikan semua environment variables dikonfigurasi di platform deployment (Vercel, Firebase, etc.)

---

## 🤝 Kontribusi

Kami sangat mengapresiasi kontribusi dari komunitas! 

### Cara Berkontribusi

1. **Fork Repository**
   ```bash
   git clone https://github.com/yourusername/INDONESIAN-MONITORING.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Changes**
   ```bash
   git commit -m 'feat: Add some AmazingFeature'
   ```

4. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open Pull Request**
   - Describe changes clearly
   - Link related issues
   - Add screenshots jika ada UI changes

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests untuk new features
- Update documentation
- Respect the Code of Conduct

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📖 Documentation improvement
- 🎨 UI/UX improvements
- 🔧 Performance optimization
- 🧪 Tests & test coverage
- 🌍 Internationalization (i18n)

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE). Silakan baca file LICENSE untuk informasi lengkap.

---

## 📞 Support & Contact

- 📧 Email: [info@indonesian-monitoring.id](mailto:info@indonesian-monitoring.id)
- 🐦 Twitter: [@IndonesianMonitor](https://twitter.com)
- 💬 Discord: [Join Community](https://discord.gg)
- 📱 Telegram: [@IndonesianMonitoring](https://t.me)

---

## 📚 Resources & References

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

### Learning Resources
- [Next.js Tutorial](https://nextjs.org/learn)
- [React Patterns](https://github.com/chentsulin/awesome-react-patterns)
- [Web Performance](https://web.dev/performance/)

### Tools
- [Visual Studio Code](https://code.visualstudio.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub CLI](https://cli.github.com/)

---

## 🌟 Acknowledgments

Terima kasih kepada semua kontributor dan komunitas yang mendukung proyek ini!

**Special Thanks to:**
- MapLibre community
- Next.js team
- Tailwind CSS team
- Semua open source projects yang digunakan

---

<div align="center">

### Made with ❤️ for Indonesian Disaster Mitigation

⭐ **Star this repository** jika proyek ini bermanfaat!  
🍴 **Fork** untuk customize sesuai kebutuhan  
📢 **Share** dengan komunitas developer Indonesia

[⬆ Back to top](#-indonesian-monitoring)

</div>
