# 🔥 Firebase Chatbot - Setup Guide

## Overview
This is a standalone Python chatbot that stores all conversations in Firebase Firestore **without requiring user login**. It uses the Mistral-7B AI model and provides search functionality for stored conversations.

## Features
✅ **Stateless Storage** - No user authentication required  
✅ **Firebase Firestore** - All conversations stored in cloud database  
✅ **Semantic Search** - Find similar conversations  
✅ **Interactive Chat** - Real-time conversation with AI  
✅ **Statistics** - Track conversation metrics  
✅ **Recent History** - View past conversations  

---

## 📋 Prerequisites

1. **Python 3.8+**
2. **Mistral-7B Model** (GGUF file)
3. **Firebase Account** (Free tier works!)

---

## 🚀 Installation

### Step 1: Install Dependencies

```bash
pip install firebase-admin sentence-transformers llama-cpp-python langchain-community
```

### Step 2: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **mindneoxai**
3. Click ⚙️ **Project Settings** → **Service Accounts**
4. Click **"Generate New Private Key"**
5. Save the JSON file

### Step 3: Update Firebase Configuration

Open `firebase_chatbot.py` and replace the `FIREBASE_CONFIG` section:

```python
FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": "mindneoxai",
    "private_key_id": "YOUR_PRIVATE_KEY_ID",
    "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk@mindneoxai.iam.gserviceaccount.com",
    # ... rest of config from downloaded JSON
}
```

### Step 4: Download AI Model

Place `Mistral-7B-Instruct-v0.3.Q4_K_M.gguf` in the same directory as `firebase_chatbot.py`.

---

## 🎮 Usage

### Run the Chatbot

```bash
python firebase_chatbot.py
```

### Main Menu Options

```
1. Ask a single question
   - Quick Q&A with Firebase storage
   
2. Interactive chat mode
   - Full conversation with memory
   - Commands: search, recent, stats, quit
   
3. Search conversations
   - Find past conversations by keyword
   
4. View recent conversations
   - See last 10 chats
   
5. View statistics
   - Total conversations and messages
   
6. Exit
```

---

## 📊 Firestore Data Structure

Every conversation is stored as:

```json
conversations/{auto-generated-uuid}/
{
  "timestamp": "2025-11-08T10:30:00Z",
  "model_used": "mindneox-v1",
  "messages": [
    {
      "role": "user",
      "content": "What is machine learning?",
      "timestamp": "2025-11-08T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Machine learning is...",
      "timestamp": "2025-11-08T10:30:15Z",
      "word_count": 150,
      "char_count": 850
    }
  ],
  "embedding_id": "emb_abc123",
  "embedding_status": "stored",
  "metadata": {
    "source": "interactive_chat",
    "response_time": 15.2
  }
}
```

---

## 🔍 Search Functionality

### In Interactive Chat Mode

```bash
👤 You: search machine learning
```

This searches all conversations for "machine learning" keyword.

### Programmatic Search

```python
from firebase_chatbot import search_conversations

results = search_conversations("quantum physics", limit=5)
for conv in results:
    print(conv['messages'])
```

---

## 📈 View Statistics

```bash
👤 You: stats
```

Shows:
- Total conversations stored
- Total messages exchanged
- Collection name
- Project ID

---

## 🛠️ Troubleshooting

### Firebase Connection Failed

**Error**: `Firebase connection failed: Invalid service account`

**Fix**: 
1. Verify your service account JSON is correct
2. Check `project_id` matches your Firebase project
3. Ensure private key includes newlines: `\n`

### Model Not Found

**Error**: `Model loading failed: No such file`

**Fix**: 
1. Download Mistral-7B GGUF model
2. Place in same directory as `firebase_chatbot.py`
3. Or update `model_path` in code

### Import Errors

**Error**: `ImportError: No module named 'firebase_admin'`

**Fix**:
```bash
pip install firebase-admin
```

---

## 🎯 Example Usage

### Ask a Question
```bash
$ python firebase_chatbot.py

Choose option: 1
💬 Ask a question: What is photosynthesis?

🤖 Generating answer...
✅ Answer (120 words):
Photosynthesis is the process by which plants...

✅ Saved to Firebase Firestore!
   Chat ID: a1b2c3d4...
```

### Interactive Chat
```bash
$ python firebase_chatbot.py

Choose option: 2

👤 You: Hello!
🤖 Mindneox.ai: Hi! How can I help you today?
⚡ Response time: 2.5s
✅ Saved to Firebase! (ID: xyz123...)

👤 You: search photosynthesis
📚 Found 3 matching conversations:
1. Chat ID: a1b2c3d4...
   Time: 2025-11-08T10:30:00Z
   User: What is photosynthesis?
   Assistant: Photosynthesis is the process...

👤 You: stats
📊 Firebase Firestore Statistics:
   Total Conversations: 45
   Total Messages: 128
   Collection: conversations

👤 You: quit
👋 Goodbye! Thanks for chatting!
```

---

## 🔐 Security Notes

⚠️ **Important**: Never commit your Firebase service account key to Git!

Add to `.gitignore`:
```
firebase_chatbot.py  # If it contains hardcoded keys
firebase-service-account.json
*.json
```

**Best Practice**: Use environment variables:

```python
import os
import json

FIREBASE_CONFIG = json.loads(os.getenv('FIREBASE_CONFIG'))
```

---

## 📦 Project Structure

```
llm testing/
├── firebase_chatbot.py          # Main chatbot file
├── main.py                       # Original Pinecone version
├── Mistral-7B-Instruct-v0.3.Q4_K_M.gguf  # AI model
├── requirements.txt              # Dependencies
└── FIREBASE_SETUP.md            # This file
```

---

## 🆚 Comparison with Google Colab Version

| Feature | Colab (COLAB_COPY_PASTE_CELLS.txt) | Standalone (firebase_chatbot.py) |
|---------|-------------------------------------|----------------------------------|
| Platform | Google Colab (Browser) | Local/Server (CLI) |
| GPU | Free Tesla T4 | Local GPU/CPU |
| Storage | Pinecone + Firebase | Firebase only |
| Login | Not required | Not required |
| Search | Semantic (embeddings) | Keyword-based |
| Interface | Notebook cells | CLI menu |

---

## 🚀 Next Steps

1. ✅ Run `firebase_chatbot.py` locally
2. ✅ Test conversation storage
3. ✅ Try search functionality
4. 🔲 Add semantic search with embeddings
5. 🔲 Create web UI (Flask/FastAPI)
6. 🔲 Deploy to cloud (AWS/GCP/Heroku)

---

## 📝 License

MIT License - Free to use and modify

---

## 🤝 Support

For issues or questions:
- Check Firebase Console for stored data
- Verify service account permissions
- Test with simple question first

---

## 🎉 Success!

You now have a fully functional Firebase chatbot that:
- ✅ Stores ALL conversations in Firestore
- ✅ Works WITHOUT user login
- ✅ Provides search functionality
- ✅ Tracks conversation statistics
- ✅ Runs locally or on server

**Enjoy chatting with your AI assistant!** 🚀
