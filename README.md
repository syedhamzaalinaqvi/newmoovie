# Netflix-Style Streaming Site - README

## 🎬 StreamFlix - Movie & TV Series Platform

A premium Netflix-style streaming platform built with Next.js 14, featuring TMDB integration and a comprehensive admin panel.

## ✨ Features

### Frontend
- **Premium UI Design**: Netflix-inspired dark theme with vibrant gradients and glassmorphism
- **Hero Section**: Dynamic featured content with auto-playing backgrounds
- **Content Browsing**: 
  - Browse by movies or TV series
  - Filter by genre, country, and type
  - Search functionality
  - Horizontal scrolling content rows
- **Detail Pages**: Full movie/series information with cast, trailers, and recommendations
- **Responsive Design**: Optimized for all devices

### Admin Panel (`/admin`)
- **Secure Login**: Username: `hworlplayz`, Password: `howrldplayz@512`
- **Dashboard**: Real-time statistics (total movies, series, views)
- **TMDB Integration**: 
  - Search movies/series from TMDB
  - Auto-fetch all metadata (cast, genres, ratings, etc.)
  - One-click add to site
- **Content Management**: View and delete added content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm installed
- TMDB API key (already configured: `46d13701165988b5bb5fb4d123c0447e`)

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Open Browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
new movie site/
├── app/
│   ├── page.tsx              # Homepage
│   ├── browse/               # Browse page with filters
│   ├── movie/[id]/           # Movie detail pages
│   ├── series/[id]/          # Series detail pages
│   ├── admin/                # Admin panel
│   │   ├── page.tsx          # Admin dashboard
│   │   └── add/              # Add content from TMDB
│   ├── globals.css           # Design system & styles
│   └── layout.tsx            # Root layout
├── components/
│   ├── Navbar.tsx            # Navigation bar
│   ├── Hero.tsx              # Hero section
│   ├── MovieCard.tsx         # Content cards
│   ├── ContentRow.tsx        # Horizontal content rows
│   └── admin/                # Admin components
├── lib/
│   ├── tmdb.ts               # TMDB API integration
│   ├── storage.ts            # LocalStorage management
│   └── auth.ts               # Authentication
└── package.json
```

## 🎨 Design System

- **Colors**: Netflix red (#e50914), dark backgrounds, vibrant accents
- **Typography**: Inter font family
- **Effects**: Glassmorphism, smooth animations, hover effects
- **Components**: Reusable cards, buttons, inputs with consistent styling

## 🔐 Admin Panel

### Access
- URL: `/admin`
- Username: `hworlplayz`
- Password: `howrldplayz@512`

### Features
1. **Dashboard**: View statistics and manage content
2. **Add Content**: Search TMDB and add movies/series with one click
3. **Auto-Fetch**: Automatically fetches all metadata including:
   - Title, overview, release date
   - Genres, countries, languages
   - Cast and crew
   - Ratings and popularity
   - Posters and backdrops

## 📊 Data Storage

Currently uses **localStorage** for:
- Added movies and series
- Site statistics
- Admin authentication

For production, consider upgrading to:
- Vercel Postgres
- MongoDB Atlas
- Supabase

## 🌐 Deployment on Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Environment Variables** (Optional)
   - Add in Vercel dashboard if needed
   - Already configured in `.env.local`

## 🎯 Usage

### For Users
1. Browse movies and series on homepage
2. Use filters to find content by genre, country, or type
3. Search for specific titles
4. Click on any content to view details

### For Admins
1. Login at `/admin`
2. View site statistics on dashboard
3. Click "Add New Content"
4. Search for movies/series on TMDB
5. Click "Add to Site" to import with all metadata
6. Manage content from dashboard

## 🛠️ Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **API**: TMDB (The Movie Database)
- **Deployment**: Vercel-ready

## 📝 Notes

- Session expires after 24 hours
- All TMDB images are optimized via Next.js Image
- Responsive design works on mobile, tablet, and desktop
- SEO-optimized with proper meta tags

## 🔄 Future Enhancements

- Add database integration
- User authentication and watchlists
- Video player integration
- Comments and ratings
- Multi-language support
- Advanced search filters

## 📄 License

This project is for educational purposes. TMDB data is used under their API terms of service.

---

**Enjoy your Netflix-style streaming platform! 🎉**
