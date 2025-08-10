# ZPLink - Full Stack Application

A modern, full-stack URL shortening service with **7-character nanoid-based short codes**. Built with React frontend and Node.js backend.

## 🎯 Project Overview

This monorepo contains both frontend and backend for a complete URL shortening solution:

- **Frontend**: React + Vite with multilingual support (Korean/English)
- **Backend**: Node.js + Express with nanoid and MongoDB
- **Short Codes**: Consistent 7-character IDs using nanoid library

## 📁 Project Structure

```
url-shortener/
├── url-shortener-frontend/    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── i18n/             # Internationalization
│   │   ├── services/         # API integration
│   │   └── App.jsx
│   ├── .env.local            # Development config
│   ├── .env.production       # Production config
│   └── README.md
├── url-shortener-backend/     # Node.js + Express backend
│   ├── server.js             # Main server file
│   ├── package.json
│   └── README.md
└── README.md                 # This file
```

## 🚀 Quick Start

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### 2️⃣ Start Backend Server
```bash
cd url-shortener-backend
npm install
npm start  # Runs on http://localhost:3000
```

### 3️⃣ Start Frontend (New Terminal)
```bash
cd url-shortener-frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### 4️⃣ Open Application
Visit `http://localhost:5173` in your browser!

## ✨ Features

- **🔗 7-Character Short Codes**: Using nanoid for consistent, unique IDs
- **🌍 Multilingual**: Korean and English language support
- **📱 Responsive Design**: Works on all devices
- **🚀 Fast Performance**: Optimized React frontend with Vite
- **🔧 Environment Smart**: Auto-detects dev/production environments
- **💾 Persistent Storage**: MongoDB integration for URL mappings
- **📋 One-Click Copy**: Easy sharing with clipboard integration

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern hooks
- **Vite 6** - Next-generation build tool
- **React i18next** - Internationalization
- **Lucide React** - Modern icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **nanoid** - Unique ID generator (7 characters)
- **MongoDB** - Database for URL storage
- **CORS** - Cross-origin resource sharing

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd url-shortener-frontend
   npm run build
   ```
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_BASE_URL=your-backend-url`

### Backend Deployment (Render/Heroku)
1. Deploy the `url-shortener-backend` folder
2. Set MongoDB connection string
3. Ensure port configuration for hosting platform

## 📝 Environment Configuration

The frontend automatically detects the environment:
- **Development**: Connects to `http://localhost:3000`
- **Production**: Uses environment variable or fallback URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with ❤️ using React, Vite, and Node.js
- Inspired by modern URL shortening services
- Powered by nanoid for reliable short code generation

---

**© 2025 ZPLink. All rights reserved.**
