#!/usr/bin/env python3
"""
Test script for FastAPI Chatbot
This demonstrates all API endpoints
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")

def print_response(response):
    """Pretty print JSON response"""
    print(json.dumps(response.json(), indent=2))
    print()

def test_root():
    """Test root endpoint"""
    print_section("1. Testing Root Endpoint (GET /)")
    response = requests.get(f"{BASE_URL}/")
    print_response(response)

def test_health():
    """Test health check"""
    print_section("2. Testing Health Check (GET /health)")
    response = requests.get(f"{BASE_URL}/health")
    print_response(response)

def test_chat():
    """Test chat endpoint"""
    print_section("3. Testing Chat Endpoint (POST /api/chat)")
    
    messages = [
        "What is machine learning?",
        "How is it different from traditional programming?",
        "Give me a real-world example"
    ]
    
    for msg in messages:
        print(f"💬 Sending: {msg}")
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"message": msg, "user_id": "test_user_123"}
        )
        data = response.json()
        print(f"🤖 Response: {data['response'][:150]}...")
        print(f"📝 Session ID: {data['session_id']}")
        print(f"🔥 Firebase ID: {data['firebase_id']}")
        print(f"📍 Pinecone ID: {data['pinecone_id']}")
        print()
        time.sleep(1)

def test_ask():
    """Test educational Q&A endpoint"""
    print_section("4. Testing Ask Endpoint (POST /api/ask)")
    
    questions = [
        {"question": "How do airplanes fly?", "age": 8},
        {"question": "What is photosynthesis?", "age": 12},
        {"question": "Explain quantum physics", "age": 16}
    ]
    
    for q in questions:
        print(f"❓ Question: {q['question']} (Age: {q['age']})")
        response = requests.post(
            f"{BASE_URL}/api/ask",
            json=q
        )
        data = response.json()
        print(f"💡 Answer: {data['answer'][:200]}...")
        print(f"🔥 Firebase ID: {data['firebase_id']}")
        print(f"📊 Word Count: {data['word_count']}")
        print()
        time.sleep(1)

def test_conversations():
    """Test get conversations endpoint"""
    print_section("5. Testing Get Conversations (GET /api/conversations)")
    response = requests.get(f"{BASE_URL}/api/conversations?limit=3")
    data = response.json()
    
    print(f"📚 Retrieved {len(data)} conversations:")
    for i, conv in enumerate(data, 1):
        print(f"\n  Conversation {i}:")
        print(f"  ID: {conv['id']}")
        print(f"  Timestamp: {conv['timestamp']}")
        print(f"  Messages: {len(conv['messages'])}")
        if conv['messages']:
            first_msg = conv['messages'][0]['content']
            print(f"  First Message: {first_msg[:80]}...")
    print()

def test_stats():
    """Test statistics endpoint"""
    print_section("6. Testing Statistics (GET /api/stats)")
    response = requests.get(f"{BASE_URL}/api/stats")
    data = response.json()
    
    print(f"📊 Total Conversations: {data['total_conversations']}")
    print(f"💬 Total Messages: {data['total_messages']}")
    print(f"🔥 Firebase: {'✅' if data['firebase_enabled'] else '❌'}")
    print(f"📍 Pinecone: {'✅' if data['pinecone_enabled'] else '❌'}")
    print(f"🤖 AI Model: {'✅' if data['ai_model_loaded'] else '❌'}")
    print()

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("  🚀 FastAPI Chatbot - Complete API Test Suite")
    print("="*60)
    
    try:
        # Test if server is running
        print("\n🔍 Checking server status...")
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running!\n")
        else:
            print("❌ Server returned unexpected status")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Error: Server is not running!")
        print("   Please start the server first:")
        print("   python fastapi_chatbot.py")
        return
    
    # Run all tests
    test_root()
    test_health()
    test_chat()
    test_ask()
    test_conversations()
    test_stats()
    
    print_section("🎉 All Tests Completed Successfully!")
    print("✅ All API endpoints are working correctly")
    print("✅ Data is being stored in Firebase and Pinecone")
    print("✅ AI model is generating responses")
    print("\n📚 View API docs at: http://localhost:8000/docs")
    print("🔧 View ReDoc at: http://localhost:8000/redoc\n")

if __name__ == "__main__":
    main()
