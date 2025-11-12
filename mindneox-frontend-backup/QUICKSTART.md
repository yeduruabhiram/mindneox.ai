# 🚀 Quick Start Guide - MindNeox.AI Frontend

## ⚡ 3-Step Setup

### Step 1: Install Dependencies

```bash
cd mindneox-frontend
npm install
```

### Step 2: Start Backend (FastAPI)

In a separate terminal:

```bash
cd "../llm testing"
python fastapi_chatbot.py
```

Backend will run on: **http://localhost:8000**

### Step 3: Start Frontend

```bash
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎯 What You Get

✅ **5 Complete Pages**:
- 🏠 Home - Hero + Features
- 💬 Chatbot - Real-time AI chat
- 🤖 AI Agent - Agent management
- 🛒 Marketplace - Plugin store
- 📊 Dashboard - Analytics

✅ **Glassmorphic Design**:
- Frosted glass effects
- Neon gradients (Cyan, Violet, Magenta)
- Particle animations
- 3D hover effects

✅ **Full Integration**:
- FastAPI backend connection
- Firebase storage
- Pinecone vectors
- Real-time chat

---

## 🔥 Test It Out

1. Visit http://localhost:3000
2. Click **"Try Chatbot"** button
3. Send a message: "What is AI?"
4. Watch the magic happen! ✨

---

## 📱 Pages

| Route | Page | Features |
|-------|------|----------|
| `/` | Home | Hero, Stats, Features, CTA |
| `/chatbot` | Chatbot | Real-time chat, Message history |
| `/ai-agent` | AI Agent | Agent cards, Metrics, Config |
| `/marketplace` | Marketplace | 6+ plugins, Search, Filters |
| `/dashboard` | Dashboard | Analytics, Activity, Status |

---

## 🎨 Key Features

### Glassmorphism

```jsx
className="glass-card glass-hover"
```

### Gradient Text

```jsx
className="gradient-text"
```

### Neon Glow

```jsx
className="neon-glow-hover"
```

---

## 🛠️ Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production
npm run preview

# Lint
npm run lint
```

---

## 📊 Tech Stack

- React 18.3
- Vite 5.3
- Tailwind CSS 3.4
- Framer Motion 11
- React Router 6
- Axios
- Lucide Icons

---

## 🔌 API Endpoints Used

```javascript
POST /api/chat          // Send chat message
GET  /api/conversations // Get conversations
GET  /api/stats         // Get statistics
```

---

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Start backend
3. ✅ Start frontend
4. 🎨 Customize colors in `tailwind.config.js`
5. 📝 Add more plugins to marketplace
6. 🚀 Deploy to Vercel/Netlify

---

## 💡 Pro Tips

**Tip 1**: Keep FastAPI server running for chatbot to work

**Tip 2**: Check browser console for API errors

**Tip 3**: Use `/docs` endpoint to test API: http://localhost:8000/docs

**Tip 4**: Customize colors in `tailwind.config.js`

---

## 🐛 Common Issues

### Issue: API Not Connected
**Solution**: Start FastAPI backend first

### Issue: Port Already in Use
**Solution**: `lsof -ti:3000 | xargs kill -9`

### Issue: Dependencies Failed
**Solution**: 
```bash
rm -rf node_modules
npm install
```

---

## 🎉 Success!

If you see:

```
VITE v5.3.4  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

You're all set! 🚀

---

**Need help?** Check `README.md` or API docs at http://localhost:8000/docs

**Happy coding!** 💻✨
