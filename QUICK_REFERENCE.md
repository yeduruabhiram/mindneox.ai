# 🚀 FastAPI Chatbot - Quick Reference

## Server Commands

```bash
# Start Server
python fastapi_chatbot.py

# Stop Server  
CTRL + C

# Check Status
curl http://localhost:8000/health
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API info |
| `/health` | GET | Health check |
| `/api/chat` | POST | General chat |
| `/api/ask` | POST | Educational Q&A |
| `/api/conversations` | GET | List conversations |
| `/api/conversations/{id}` | GET | Get specific conversation |
| `/api/conversations/{id}` | DELETE | Delete conversation |
| `/api/stats` | GET | Usage statistics |

## Quick Test Commands

```bash
# Health Check
curl http://localhost:8000/health

# Chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'

# Educational (Age 10)
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "How do airplanes fly?", "age": 10}'

# Get Stats
curl http://localhost:8000/api/stats
```

## URLs

- **Home**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Python Quick Test

```python
import requests

# Chat
r = requests.post('http://localhost:8000/api/chat',
    json={'message': 'What is AI?'})
print(r.json()['response'])

# Ask
r = requests.post('http://localhost:8000/api/ask',
    json={'question': 'How does rain form?', 'age': 10})
print(r.json()['answer'])
```

## Files

- `fastapi_chatbot.py` - Main API server
- `FASTAPI_GUIDE.md` - Complete documentation
- `test_api.py` - Test all endpoints
- `chatbot_web.html` - Web interface
- `SETUP_COMPLETE.md` - Full setup summary

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:8000 \| xargs kill -9` |
| Can't connect | Start server: `python fastapi_chatbot.py` |
| Slow responses | Normal (5-30 sec on free GPU) |
| Model not found | Check `.gguf` file exists |

## Status

✅ Server Running: http://localhost:8000
✅ Firebase Connected: mindneoxai
✅ Pinecone Connected: mindnex-responses  
✅ AI Model Loaded: Mistral-7B (GPU)
✅ All Systems Operational

---

**Need more help?** Read `FASTAPI_GUIDE.md`
