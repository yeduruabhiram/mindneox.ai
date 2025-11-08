# 🚀 MindNeox.AI Frontend

A futuristic, glassmorphic React application for the MindNeox.AI ecosystem - The Super AI Operating System.

![MindNeox.AI](https://img.shields.io/badge/MindNeox-AI%20OS-00B4FF?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🏠 **Home Page**
- Stunning hero section with animated holographic brain
- Feature showcase with 6 key capabilities
- Real-time statistics display
- Glassmorphic design with particle background

### 💬 **Chatbot Page**
- Real-time AI chat interface
- Integration with FastAPI backend (http://localhost:8000)
- Message history with timestamps
- Firebase & Pinecone storage
- Powered by Mistral-7B

### 🤖 **AI Agent Studio**
- Deploy and manage autonomous AI agents
- Real-time metrics dashboard
- Agent configuration panel
- Status monitoring

### 🛒 **Marketplace**
- AI Plugin Store with 6+ plugins
- Category filtering (Agents, Dev Tools, Memory, Voice & Vision, etc.)
- Search functionality
- Plugin detail drawer with install button
- Featured & Trending sections
- Rating and install count display

### 📊 **Dashboard**
- Real-time analytics
- Recent activity feed
- Top plugins leaderboard
- System status monitoring (Firebase, Pinecone, AI Model)

## 🎨 Design Features

- **Glassmorphism UI**: Frosted glass effects with backdrop blur
- **Neon Gradients**: Cyan (#00B4FF), Violet (#7D4FFF), Magenta (#FF00C8)
- **Particle Background**: Animated particles with connection lines
- **3D Animations**: Floating, rotating, and hovering effects
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Deep dark gradients (#0D0F14 → #141820)

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **Vite 5.3** - Build tool
- **React Router 6** - Routing
- **Framer Motion 11** - Animations
- **Tailwind CSS 3.4** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📦 Installation

### Prerequisites

- Node.js 18+ or npm/yarn
- FastAPI backend running on http://localhost:8000

### Step 1: Install Dependencies

```bash
cd mindneox-frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Step 3: Build for Production

```bash
npm run build
```

### Step 4: Preview Production Build

```bash
npm run preview
```

## 🔌 API Integration

The chatbot page connects to your FastAPI backend:

```javascript
// src/pages/ChatbotPage.jsx
axios.post('/api/chat', {
  message: input,
  user_id: 'web_user',
})
```

Ensure your FastAPI server is running:

```bash
python fastapi_chatbot.py
```

## 📁 Project Structure

```
mindneox-frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx          # Main layout wrapper
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── ParticleBackground.jsx  # Animated particles
│   ├── pages/           # Page components
│   │   ├── HomePage.jsx        # Landing page
│   │   ├── ChatbotPage.jsx     # AI chat interface
│   │   ├── AIAgentPage.jsx     # Agent management
│   │   ├── MarketplacePage.jsx # Plugin store
│   │   └── DashboardPage.jsx   # Analytics
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  dark: {
    900: '#0D0F14',
    800: '#141820',
    700: '#1A1D28',
  },
  neon: {
    cyan: '#00B4FF',
    magenta: '#FF00C8',
    violet: '#7D4FFF',
  },
}
```

### Fonts

The app uses:
- **Space Grotesk** - Headings
- **Inter** - Body text

Fonts are loaded via Google Fonts in `index.html`.

## 🔧 Configuration

### Vite Config

```javascript
// vite.config.js
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### API Proxy

All `/api/*` requests are proxied to `http://localhost:8000` automatically.

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t mindneox-frontend .
docker run -p 3000:3000 mindneox-frontend
```

## 📱 Pages Overview

### 1. Home (`/`)
- Hero section with animated brain hologram
- Statistics cards (Uptime, Response Time, Queries, Models)
- Features grid (6 features)
- CTA section

### 2. Chatbot (`/chatbot`)
- Real-time messaging interface
- User/AI message bubbles
- Loading indicator
- Clear chat button
- Integration with FastAPI backend

### 3. AI Agent (`/ai-agent`)
- 3 pre-configured agents
- Metrics dashboard (Tasks, Active Agents, CPU, Memory)
- Start/Stop controls
- Configuration panel

### 4. Marketplace (`/marketplace`)
- 6+ plugin cards
- Search bar with glow effect
- Category filters (7 categories)
- Featured carousel
- Plugin detail drawer
- Install buttons

### 5. Dashboard (`/dashboard`)
- 4 stat cards
- Recent activity feed
- Top plugins chart
- System status (Firebase, Pinecone, AI Model)

## 🎯 Key Components

### Glass Card

```jsx
<div className="glass-card glass-hover">
  {/* Content */}
</div>
```

### Gradient Text

```jsx
<span className="gradient-text">
  MindNeox.AI
</span>
```

### Neon Glow

```jsx
<button className="neon-glow-hover">
  Click Me
</button>
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

### API Connection Failed

1. Verify FastAPI server is running: `curl http://localhost:8000/health`
2. Check Vite proxy configuration in `vite.config.js`
3. Ensure CORS is enabled on backend

### Build Errors

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

## 📚 Resources

- **Design Inspiration**: Figma designs (glassmorphic AI OS)
- **React Docs**: https://react.dev
- **Framer Motion**: https://www.framer.com/motion
- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Design inspiration from futuristic AI interfaces
- Glassmorphism trend by Apple and Microsoft
- MindNeox.AI community

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

🚀 **Ready to explore the future of AI?** Start the dev server and visit http://localhost:3000

For backend integration, see: `../fastapi_chatbot.py`
