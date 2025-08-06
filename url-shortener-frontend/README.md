# URL Shortener

A clean, modern URL shortening service built with React and Vite. Transform your long URLs into short, shareable links with multilingual support.

## ✨ Features

- **⚡ Fast**: Lightning-fast URL shortening with custom nanoid backend
- **🌍 Multilingual**: Korean and English language support
- **📱 Responsive**: Works perfectly on all devices
- **🔧 Simple**: Clean, minimal interface focused on usability
- **📋 Copy**: One-click clipboard functionality
- **🔒 Reliable**: Consistent 7-character nanoid-based short codes
- **🌐 Environment Smart**: Auto-detects development vs production

## 🛠️ Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite 6** - Next-generation build tool
- **React i18next** - Internationalization
- **Lucide React** - Modern icon library
- **Axios** - HTTP client with timeout handling

## 🚀 Quick Start

### Frontend Only
```bash
# Clone repository
git clone <repository-url>
cd url-shortener-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Full Stack Development
```bash
# 1. Start the backend server first
cd ../url-shortener-backend
npm install
npm start  # Runs on localhost:3000

# 2. Start the frontend (in a new terminal)
cd ../url-shortener-frontend
npm install
npm run dev  # Runs on localhost:5173
```

Open `http://localhost:5173` in your browser.

## 🌐 Available Scripts

- `npm run dev` - Start development server (connects to localhost:3000 backend)
- `npm run build` - Build for production (uses production API URL)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Frontend Deployment
1. **Configure Backend URL**:
   ```bash
   # Update .env.production with your backend URL
   VITE_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   # Deploy 'dist' folder to Vercel, Netlify, etc.
   ```

### Environment-Specific Setup
- **Vercel**: Set `VITE_API_BASE_URL` in environment variables
- **Netlify**: Add build environment variable  
- **Local**: Use `.env.local` file (auto-detected)

### Backend Requirements
- Ensure your backend is deployed and accessible
- Backend should support `/shorten` POST endpoint
- Backend should return `{ shortUrl, shortId }` format

## 🎨 Design Philosophy

- **Minimalism**: Clean, distraction-free interface
- **System Fonts**: Native typography for better performance
- **Subtle Interactions**: Gentle hover effects and transitions
- **Focus on Function**: Every element serves a purpose
- **Mobile First**: Optimized for touch interactions

## 🌍 Internationalization

- **Korean (한국어)** - Default language
- **English** - Full translation support
- **Auto Detection** - Based on browser settings
- **Manual Toggle** - Easy language switching

## ⚡ Performance Features

- **Environment Auto-Detection**: Seamless switching between development and production APIs
- **Nanoid Integration**: Consistent 7-character short codes using nanoid library
- **30-Second Timeout**: Prevents infinite waiting
- **Smart Error Handling**: Clear feedback for users with specific error messages
- **URL Validation**: Basic format checking before API calls

## 🔗 API Services

### Custom Nanoid Backend
- **Development**: `http://localhost:3000` - Local Node.js + Express server
- **Production**: Configurable via environment variables
- **Features**: 
  - Nanoid-based 7-character short codes
  - MongoDB storage for URL mappings
  - Fast redirect service
  - Consistent URL format

### Environment Configuration
- **Auto-Detection**: Automatically uses correct API based on environment
- **Flexible Setup**: Easy configuration via `.env` files
- **Development**: Works with local backend server
- **Production**: Configurable for any deployment platform

## 🏗️ Architecture

```
src/
├── components/          # Reusable components
│   └── LanguageToggle/ # Language switcher
├── i18n/               # Internationalization
│   ├── index.js        # i18n configuration
│   └── locales/        # Translation files
├── services/           # API layer
│   └── api.js         # URL shortening logic (with env detection)
├── App.jsx            # Main component
└── .env files         # Environment configuration
    ├── .env.local      # Development settings (git ignored)
    └── .env.production # Production settings
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 📝 Copyright

© 2025 URL Shortener. All rights reserved.

Built with ❤️ using React and Vite.
