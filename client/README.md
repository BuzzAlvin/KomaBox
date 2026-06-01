# 📚 KomaBox — Manga Discovery & Reading App

KomaBox is a modern, fullstack manga reading web app built with **React + Vite** on the frontend and **Node.js + Express** on the backend. It fetches manga data from the MangaDex API and delivers a smooth, mobile-friendly reading experience with chapter navigation, bookmarks, search, recommendations, and more.

🔗 **Live Demo:** [https://komabox.pages.dev](https://komabox.pages.dev)

---

## 🚀 Features

- 🔍 **Live Search** — Real-time manga search with dropdown suggestions and caching
- 📖 **Chapter Reader** — Smooth chapter-by-chapter reading with next/previous navigation
- 📚 **Manga Details** — Author, artist, tags, status, ratings, and follows
- 🔖 **Bookmarks** — Save favorites with persistent localStorage and instant UI sync
- 🖼️ **Random Discovery** — Explore manga covers with infinite pagination
- 💡 **Smart Recommendations** — Tag-based recommendations on each manga page
- ⚡ **Backend Proxy** — Solves CORS issues and bypasses MangaDex hotlink protection
- 📱 **Fully Responsive** — Mobile-first design with adaptive layouts
- 🌙 **Dark / Light Mode** — Theme toggle with persistent preference
- 🚀 **Optimized Deployment** — Frontend on Cloudflare Pages, Backend on Render

---

## 🎯 Core Pages

### 🔎 Search
- Live search with dropdown suggestions
- Full search results page with pagination
- Caching of recent searches
- First & latest chapter indicators

### 📖 Manga Detail Page
- Cover preview with blurred backdrop
- Description with expandable "Show More / Show Less"
- Chapter list with timestamps
- Tabs for Chapters, Comments, and Recommendations
- Bookmark toggle

### 📑 Chapter Reader
- Clean, distraction-free reading interface
- Chapter navigation (previous / next / select chapter)
- Breadcrumb navigation
- Responsive image rendering

### ❤️ Bookmarks
- Add / remove manga from bookmarks
- Persistent storage using `localStorage`
- Synced across the app instantly
- Click-to-open bookmarked manga

### 🖼 Images Page
- Random manga cover browsing
- Pagination support
- Smooth scroll-to-top behavior
- Responsive grid layout

### 🎨 UI & UX
- Fully responsive (mobile, tablet, desktop)
- Mobile sidebar navigation with auto-close on route change
- Dark / Light mode toggle
- Smooth transitions and hover states
- Skeleton loaders for better perceived performance

---

## 🛠 Tech Stack

### Frontend
- **React 18** (with Hooks-based architecture)
- **Vite** (lightning-fast build tool)
- **React Router** (client-side routing)
- **Tailwind CSS** (utility-first styling)
- **Framer Motion** (smooth animations)
- **React Icons** (icon library)
- **localStorage** (client-side persistence)

### Backend
- **Node.js**
- **Express.js**
- **MangaDex API proxy layer**
- **CORS handling**
- **Compression** (response optimization)

### Deployment
- **Frontend:** [Cloudflare Pages](https://pages.cloudflare.com/) — Unlimited bandwidth
- **Backend:** [Render](https://render.com/) — Free tier hosting
- **Uptime:** [UptimeRobot](https://uptimerobot.com/) — Keeps Render awake

---

## 📦 Installation

### 1. Clone the repository
git clone https://github.com/BuzzAlvin/KomaBox.git

### Navigate into project folder
cd KomaBox

### Install Frontend dependencies
cd client
npm install

### Install Backend dependencies
cd server
npm install

### Start development server for Frontend and Backend
npm run dev

## 🔐 Data Persistence
Stores user's bookmarked manga locally using:
- localStorage

### Key used:
- komabox_bookmarks

## 📡 API

### Endpoints used include:

- GET /api/homepage
- GET /api/manga/:mangaId
- GET /api/chapters/:mangaId
- GET /api/read/:chapterId
- GET /api/recommendations/:mangaId
- GET /api/random-manga
- GET /api/search

### MangaDex API (Used by Backend)
- /manga
- /manga/{id}
- /manga/{id}/aggregate
- /manga/{id}/feed
- /chapter
- /at-home/server/{chapterId}
- /statistics/manga/{id}

## 🧠 Architecture Highlights
- Custom React Hooks — Centralized data fetching (useHomepage, useChapter, useMangaDetail, etc.)
- Modular API Layer — All API calls live in api/mangadex.js
- Backend Proxy Pattern — Solves CORS and hotlink protection
- Utility-Based Storage — Reusable localStorage helpers (bookmarkStorage.js)
- Scroll Management — Smooth scroll behavior across pages
- Mobile-First Responsive Design — Tailwind breakpoints throughout
- Image Optimization — Thumbnail URLs (.256.jpg) for faster loading
- Smart Caching — Render cache headers for repeated requests

## 🌐 Deployment

### Frontend (Cloudflare Pages)
- Push repo to GitHub
- Connect to Cloudflare Pages
- #### Build settings:
Framework Preset: Vite
**Build Command:** npm run build
**Output Directory:** dist
**Root Directory:** client
**Add environment variable:**
- VITE_API_URL=https://your-backend.onrender.com/api

### Backend (Render)
- Create new Web Service on Render
- Connect GitHub repo
- Settings:
**Root Directory:** server
**Build Command:** npm install
**Start Command:** npm start
- Use UptimeRobot to keep service awake (free tier sleeps after 15 minutes)


## ✅ Future Improvements
- 🔐 User authentication (login/signup)
- ♾️ Infinite scroll on images page
- ⌨️ Keyboard navigation for reader (← → arrows)
- 🎯 Advanced filters (genre, rating, status, language)
- 🚀 Redis caching layer for backend
- 📥 Offline reading support (PWA)
- 💬 Comments system
- 📊 Reading history tracking
- 🌍 Multi-language support
- ⭐ User ratings and reviews

## 📸 Screenshots 
![desktop](public/images/desktop_ss.PNG)

![tablet view](public/images/tablet_ss.PNG)

![mobile view](public/images/mobile_ss.PNG)

## 🤝 Contributing
Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

## 👨‍💻 Author
Built by BuzzAlvin

### Install dependencies
npm install

### Start development server
npm run dev

## 🔐 Data Persistence
Bookmarks are stored locally using:
- localStorage

### Key used:
- komabox_bookmarks



## 📡 API

### Endpoints used include:

- /manga
- /manga/{id}
- /manga/{id}/aggregate
- /manga/{id}/feed
- /at-home/server/{chapterId}

## 🧠 Architecture Highlights
- Custom React hooks for data fetching
- Utility-based localStorage management
- Backend proxy to solve CORS issues
- Modular API layer (api/mangadex.js)
- Scroll management for internal layout containers
- Controlled mobile sidebar behavior
- Responsive UI system with Tailwind

## ✅ Future Improvements
- User authentication
- Infinite scroll on image page
- Keyboard navigation for reader
- Manga filters (genre, rating, status)
- Performance optimization & caching layer
- Advanced filters (genre, rating, status)
- Performance caching layer (Redis / backend cache)
- Offline reading support

## 📸 Screenshots 
![desktop](public/images/desktop_ss.PNG)

![tablet view](public/images/tablet_ss.PNG)

![mobile view](public/images/mobile_ss.PNG)

## 🤝 Contributing
Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
MIT License

## 👨‍💻 Author
Built by BuzzAlvin