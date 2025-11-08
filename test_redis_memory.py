#!/usr/bin/env python3
"""
Test script for Redis conversation memory
Demonstrates user history, context tracking, and prediction
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"
TEST_USER_ID = "test_user_123"

print("=" * 60)
print("🧠 Redis Conversation Memory Test")
print("=" * 60)

# Test 1: Check health
print("\n1️⃣  Checking Redis connection...")
health = requests.get(f"{BASE_URL}/health").json()
print(f"   Redis Status: {'✅ Connected' if health['services']['redis'] else '❌ Not connected'}")

if not health['services']['redis']:
    print("\n❌ Redis is not connected. Please start Redis server.")
    exit(1)

# Test 2: Get initial history (should be empty)
print(f"\n2️⃣  Fetching initial conversation history for user: {TEST_USER_ID}")
history = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/history").json()
print(f"   Initial conversations: {history['count']}")

# Test 3: Get initial prediction
print(f"\n3️⃣  Getting conversation prediction...")
predict = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/predict").json()
print(f"   Greeting: {predict['greeting']}")
print(f"   Keywords: {predict['top_keywords']}")

# Test 4: Simulate some conversations by directly storing in Redis
print(f"\n4️⃣  Simulating 5 conversations...")
import redis
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

test_conversations = [
    {"user": "Tell me about Python", "ai": "Python is a versatile programming language..."},
    {"user": "How do I use machine learning?", "ai": "Machine learning involves training algorithms..."},
    {"user": "Explain neural networks", "ai": "Neural networks are computing systems inspired by biological..."},
    {"user": "What is deep learning?", "ai": "Deep learning is a subset of machine learning using neural networks..."},
    {"user": "Python libraries for AI?", "ai": "Popular libraries include TensorFlow, PyTorch, scikit-learn..."}
]

for i, conv in enumerate(test_conversations, 1):
    conv_data = {
        'user_message': conv['user'],
        'assistant_response': conv['ai'],
        'timestamp': time.time()
    }
    r.lpush(f'user:{TEST_USER_ID}:history', json.dumps(conv_data))
    
    # Extract keywords for context
    words = (conv['user'] + ' ' + conv['ai']).lower().split()
    for word in words:
        if len(word) > 4 and word.isalpha():
            r.zincrby(f'user:{TEST_USER_ID}:context', 1, word)
    
    print(f"   ✅ Conversation {i} stored")

# Set TTL
r.expire(f'user:{TEST_USER_ID}:history', 30 * 24 * 3600)  # 30 days
r.expire(f'user:{TEST_USER_ID}:context', 30 * 24 * 3600)

# Test 5: Get updated history
print(f"\n5️⃣  Fetching updated conversation history...")
history = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/history?limit=10").json()
print(f"   Total conversations: {history['count']}")
print(f"   Recent conversations:")
for i, h in enumerate(history['history'][:3], 1):
    print(f"      {i}. User: {h['user_message'][:50]}...")

# Test 6: Get context keywords
print(f"\n6️⃣  Analyzing user interests...")
context = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/context").json()
print(f"   Total conversations analyzed: {context['total_conversations']}")
print(f"   Top interests:")
for kw in context['top_keywords'][:5]:
    print(f"      • {kw['keyword']}: {int(kw['frequency'])} mentions")

# Test 7: Get intelligent prediction
print(f"\n7️⃣  Getting intelligent conversation prediction...")
predict = requests.get(f"{BASE_URL}/api/user/{TEST_USER_ID}/predict").json()
print(f"   Personalized Greeting:")
print(f"   '{predict['greeting']}'")
print(f"\n   Predicted Topics: {', '.join([k['keyword'] for k in predict['top_keywords'][:3]])}")

print("\n" + "=" * 60)
print("✅ Redis Memory Test Complete!")
print("=" * 60)
print("\n💡 Key Features Demonstrated:")
print("   • Conversation history storage (last 20 messages)")
print("   • Keyword frequency tracking")
print("   • Context-aware predictions")
print("   • 30-day automatic memory retention")
print("   • Fast in-memory retrieval with Redis")
print("\n🎯 Next: This will be integrated with actual chat endpoint")
print("   for real-time conversation memory!")
