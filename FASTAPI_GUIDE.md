# 🚀 FastAPI Chatbot - Complete Guide

## Overview

A production-ready REST API for Mindneox.ai chatbot with Firebase Firestore storage and Pinecone vector search.

---

## 📦 Installation

### Step 1: Install Dependencies

```bash
pip install fastapi uvicorn firebase-admin sentence-transformers
```

Or install all requirements:

```bash
pip install -r requirements.txt
```

### Step 2: Verify Model File

Ensure `Mistral-7B-Instruct-v0.3.Q4_K_M.gguf` is in the same directory.

---

## 🚀 Running the Server

### Start the API server:

```bash
python fastapi_chatbot.py
```

Or with uvicorn directly:

```bash
uvicorn fastapi_chatbot:app --reload --host 0.0.0.0 --port 8000
```

### Server will start on:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs (Interactive Swagger UI)
- **ReDoc**: http://localhost:8000/redoc (Alternative docs)

---

## 📚 API Endpoints

### 1. Root Endpoint

**GET** `/`

Get API information and available endpoints.

```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "message": "Mindneox.ai Chatbot API",
  "version": "1.0.0",
  "status": "running",
  "firebase": "connected",
  "pinecone": "connected",
  "ai_model": "loaded",
  "docs": "/docs"
}
```

---

### 2. Health Check

**GET** `/health`

Check service health and status.

```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-08T12:30:00",
  "services": {
    "firebase": true,
    "pinecone": true,
    "ai_model": true,
    "embedding_model": true
  }
}
```

---

### 3. Chat Endpoint

**POST** `/api/chat`

Send a message and get AI response.

**Request Body:**
```json
{
  "message": "What is artificial intelligence?",
  "user_id": "user123",
  "session_id": "session456"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is artificial intelligence?",
    "user_id": "user123"
  }'
```

**Response:**
```json
{
  "response": "Artificial intelligence (AI) is...",
  "session_id": "abc123-def456",
  "timestamp": "2025-11-08T12:30:00",
  "firebase_id": "conversation-uuid",
  "pinecone_id": "api_20251108_123000_abc123"
}
```

---

### 4. Ask Question (Educational)

**POST** `/api/ask`

Get educational explanation for any topic.

**Request Body:**
```json
{
  "question": "How does photosynthesis work?",
  "topic": "photosynthesis",
  "age": 12
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does photosynthesis work?",
    "age": 12
  }'
```

**Response:**
```json
{
  "answer": "Photosynthesis is how plants make food...",
  "question": "How does photosynthesis work?",
  "firebase_id": "conversation-uuid",
  "word_count": 150,
  "timestamp": "2025-11-08T12:30:00"
}
```

---

### 5. Get Conversations

**GET** `/api/conversations?limit=10`

Retrieve recent conversations from Firebase.

**cURL Example:**
```bash
curl http://localhost:8000/api/conversations?limit=5
```

**Response:**
```json
[
  {
    "id": "conversation-uuid-1",
    "timestamp": "2025-11-08T12:30:00",
    "messages": [
      {
        "role": "user",
        "content": "What is AI?",
        "timestamp": "2025-11-08T12:30:00"
      },
      {
        "role": "assistant",
        "content": "AI is...",
        "timestamp": "2025-11-08T12:30:05",
        "word_count": 120,
        "char_count": 650
      }
    ],
    "model_used": "mindneox-v1"
  }
]
```

---

### 6. Get Single Conversation

**GET** `/api/conversations/{conversation_id}`

Get a specific conversation by ID.

**cURL Example:**
```bash
curl http://localhost:8000/api/conversations/abc123-def456
```

**Response:**
```json
{
  "id": "abc123-def456",
  "timestamp": "2025-11-08T12:30:00",
  "messages": [...],
  "model_used": "mindneox-v1"
}
```

---

### 7. Get Statistics

**GET** `/api/stats`

Get API usage statistics.

**cURL Example:**
```bash
curl http://localhost:8000/api/stats
```

**Response:**
```json
{
  "total_conversations": 150,
  "total_messages": 420,
  "firebase_enabled": true,
  "pinecone_enabled": true,
  "ai_model_loaded": true
}
```

---

### 8. Delete Conversation

**DELETE** `/api/conversations/{conversation_id}`

Delete a conversation by ID.

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/api/conversations/abc123-def456
```

**Response:**
```json
{
  "message": "Conversation deleted successfully",
  "id": "abc123-def456"
}
```

---

## 💻 Python Client Example

### Using `requests` library:

```python
import requests
import json

BASE_URL = "http://localhost:8000"

# 1. Chat with the bot
def chat(message):
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"message": message}
    )
    return response.json()

# 2. Ask educational question
def ask_question(question, age=12):
    response = requests.post(
        f"{BASE_URL}/api/ask",
        json={
            "question": question,
            "age": age
        }
    )
    return response.json()

# 3. Get recent conversations
def get_conversations(limit=10):
    response = requests.get(
        f"{BASE_URL}/api/conversations?limit={limit}"
    )
    return response.json()

# 4. Get stats
def get_stats():
    response = requests.get(f"{BASE_URL}/api/stats")
    return response.json()

# Example usage
if __name__ == "__main__":
    # Chat
    result = chat("What is machine learning?")
    print(f"Response: {result['response']}")
    print(f"Saved to Firebase: {result['firebase_id']}")
    
    # Ask
    result = ask_question("How do airplanes fly?", age=10)
    print(f"Answer: {result['answer']}")
    
    # Get conversations
    conversations = get_conversations(limit=5)
    print(f"Total conversations: {len(conversations)}")
    
    # Stats
    stats = get_stats()
    print(f"Total messages: {stats['total_messages']}")
```

---

## 🌐 JavaScript/Node.js Client Example

```javascript
const BASE_URL = "http://localhost:8000";

// Chat with the bot
async function chat(message) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message })
  });
  return await response.json();
}

// Ask educational question
async function askQuestion(question, age = 12) {
  const response = await fetch(`${BASE_URL}/api/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, age })
  });
  return await response.json();
}

// Get conversations
async function getConversations(limit = 10) {
  const response = await fetch(`${BASE_URL}/api/conversations?limit=${limit}`);
  return await response.json();
}

// Example usage
(async () => {
  // Chat
  const chatResult = await chat("What is quantum computing?");
  console.log("Response:", chatResult.response);
  
  // Ask
  const askResult = await askQuestion("How does gravity work?", 10);
  console.log("Answer:", askResult.answer);
  
  // Get conversations
  const conversations = await getConversations(5);
  console.log("Conversations:", conversations.length);
})();
```

---

## 🔥 React Frontend Example

```jsx
import React, { useState } from 'react';

function ChatBot() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Mindneox.ai Chatbot</h1>
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
      {response && (
        <div>
          <h3>Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
```

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY fastapi_chatbot.py .
COPY Mistral-7B-Instruct-v0.3.Q4_K_M.gguf .

# Expose port
EXPOSE 8000

# Run server
CMD ["uvicorn", "fastapi_chatbot:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```bash
# Build Docker image
docker build -t mindneox-api .

# Run container
docker run -p 8000:8000 mindneox-api
```

---

## 🔧 Environment Variables

Create `.env` file:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
RELOAD=false

# AI Model
MODEL_PATH=Mistral-7B-Instruct-v0.3.Q4_K_M.gguf
MAX_TOKENS=500

# Firebase
FIREBASE_PROJECT_ID=mindneoxai

# Pinecone
PINECONE_API_KEY=your-api-key
PINECONE_INDEX=mindnex-responses
```

---

## 📊 Monitoring & Logging

### Add logging to track requests:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@app.middleware("http")
async def log_requests(request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response: {response.status_code}")
    return response
```

---

## 🔐 Security Best Practices

### 1. Add API Key Authentication

```python
from fastapi import Header, HTTPException

API_KEY = "your-secret-api-key"

async def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key

@app.post("/api/chat", dependencies=[Depends(verify_api_key)])
async def chat(request: ChatRequest):
    # Your code here
    pass
```

### 2. Rate Limiting

```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat(request: Request, chat_request: ChatRequest):
    # Your code here
    pass
```

### 3. CORS Configuration

Update for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific domains only
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

---

## 🚀 Production Deployment

### Using Gunicorn + Uvicorn

```bash
pip install gunicorn

# Run with multiple workers
gunicorn fastapi_chatbot:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.mindneox.ai;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📈 Performance Tips

1. **Enable Model Caching**: Model loads once on startup
2. **Use Background Tasks**: Storage operations don't block responses
3. **Redis Caching**: Add Redis for response caching
4. **Load Balancing**: Use multiple workers with Gunicorn
5. **CDN**: Serve static assets via CDN

---

## 🐛 Troubleshooting

### Model Not Loading

**Error**: `AI model not loaded`

**Fix**:
- Verify model file exists
- Check file path is correct
- Ensure enough RAM (8GB+ recommended)

### Firebase Connection Failed

**Error**: `Firebase not available`

**Fix**:
- Verify service account credentials
- Check internet connection
- Ensure Firebase project exists

### Port Already in Use

**Error**: `Address already in use`

**Fix**:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use different port
uvicorn fastapi_chatbot:app --port 8001
```

---

## 📚 API Documentation Access

Once server is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## ✅ Testing Checklist

- [ ] Server starts successfully
- [ ] Firebase connects
- [ ] AI model loads
- [ ] `/health` endpoint returns healthy
- [ ] Chat endpoint works
- [ ] Conversations saved to Firebase
- [ ] Stats endpoint shows correct counts
- [ ] API docs accessible at `/docs`

---

## 🎉 Success!

Your FastAPI chatbot is now ready for production!

**Quick Test:**
```bash
# Start server
python fastapi_chatbot.py

# In another terminal, test it:
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

**Happy coding!** 🚀🔥
