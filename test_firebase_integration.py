#!/usr/bin/env python3
"""
Quick test to verify Firebase integration in main.py
Run this to check if everything is working
"""

import sys

print("=" * 70)
print("🧪 Firebase Integration Test")
print("=" * 70)

# Test 1: Check Python version
print("\n1️⃣  Checking Python version...")
print(f"   Python {sys.version}")
if sys.version_info >= (3, 8):
    print("   ✅ Python version OK")
else:
    print("   ❌ Python 3.8+ required")
    sys.exit(1)

# Test 2: Check Firebase import
print("\n2️⃣  Checking Firebase installation...")
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    print("   ✅ Firebase installed")
    FIREBASE_OK = True
except ImportError as e:
    print(f"   ❌ Firebase not installed: {e}")
    print("   Run: pip install firebase-admin")
    FIREBASE_OK = False

# Test 3: Check Pinecone import
print("\n3️⃣  Checking Pinecone installation...")
try:
    from pinecone import Pinecone
    print("   ✅ Pinecone installed")
    PINECONE_OK = True
except ImportError:
    print("   ⚠️  Pinecone not installed (optional)")
    PINECONE_OK = False

# Test 4: Check sentence-transformers
print("\n4️⃣  Checking sentence-transformers...")
try:
    from sentence_transformers import SentenceTransformer
    print("   ✅ sentence-transformers installed")
    EMBEDDINGS_OK = True
except ImportError:
    print("   ⚠️  sentence-transformers not installed (optional)")
    EMBEDDINGS_OK = False

# Test 5: Check Redis
print("\n5️⃣  Checking Redis connection...")
try:
    import redis
    client = redis.Redis(host='localhost', port=6379, db=0)
    client.ping()
    print("   ✅ Redis connected")
    REDIS_OK = True
except Exception as e:
    print(f"   ⚠️  Redis not available: {e}")
    REDIS_OK = False

# Test 6: Check LlamaCpp
print("\n6️⃣  Checking llama-cpp-python...")
try:
    from llama_cpp import Llama
    print("   ✅ llama-cpp-python installed")
    LLAMA_OK = True
except ImportError:
    print("   ❌ llama-cpp-python not installed")
    LLAMA_OK = False

# Test 7: Check model file
print("\n7️⃣  Checking AI model file...")
import os
model_path = "Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"
if os.path.exists(model_path):
    size = os.path.getsize(model_path) / (1024**3)  # GB
    print(f"   ✅ Model found ({size:.2f} GB)")
    MODEL_OK = True
else:
    print(f"   ❌ Model not found: {model_path}")
    MODEL_OK = False

# Summary
print("\n" + "=" * 70)
print("📊 Test Summary")
print("=" * 70)

results = [
    ("Python 3.8+", True),
    ("Firebase Admin SDK", FIREBASE_OK),
    ("Pinecone Client", PINECONE_OK),
    ("Sentence Transformers", EMBEDDINGS_OK),
    ("Redis Cache", REDIS_OK),
    ("llama-cpp-python", LLAMA_OK),
    ("AI Model File", MODEL_OK)
]

for name, status in results:
    icon = "✅" if status else ("❌" if name in ["Python 3.8+", "Firebase Admin SDK", "llama-cpp-python", "AI Model File"] else "⚠️ ")
    print(f"   {icon} {name}")

print("\n" + "=" * 70)

# Required components
required = [True, FIREBASE_OK, LLAMA_OK, MODEL_OK]
if all(required):
    print("✅ All required components ready!")
    print("\n🚀 You can now run: python main.py")
else:
    print("❌ Missing required components!")
    print("\n📋 To fix:")
    if not FIREBASE_OK:
        print("   pip install firebase-admin")
    if not LLAMA_OK:
        print("   pip install llama-cpp-python")
    if not MODEL_OK:
        print("   Download Mistral-7B-Instruct-v0.3.Q4_K_M.gguf")

# Optional components
optional = [PINECONE_OK, EMBEDDINGS_OK, REDIS_OK]
if not all(optional):
    print("\n💡 Optional enhancements:")
    if not PINECONE_OK:
        print("   pip install pinecone-client  (for vector search)")
    if not EMBEDDINGS_OK:
        print("   pip install sentence-transformers  (for embeddings)")
    if not REDIS_OK:
        print("   brew install redis && brew services start redis  (for caching)")

print("=" * 70)

# Firebase configuration check
if FIREBASE_OK:
    print("\n⚙️  Next Step: Configure Firebase")
    print("-" * 70)
    print("1. Go to: https://console.firebase.google.com/")
    print("2. Project: mindneoxai")
    print("3. Settings → Service Accounts → Generate New Private Key")
    print("4. Update FIREBASE_CONFIG in main.py (lines 72-82)")
    print("-" * 70)

print("\n")
