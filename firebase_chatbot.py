#!/usr/bin/env python3
"""
Firebase Chatbot with Firestore Storage
Search and store all conversations without user login
"""

from llama_cpp import Llama
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from datetime import datetime
import uuid
import hashlib

# Firebase imports
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    from sentence_transformers import SentenceTransformer
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False
    print("⚠️  Firebase not installed. Install with:")
    print("   pip install firebase-admin sentence-transformers")
    exit(1)

print("=" * 80)
print("🔥 MINDNEOX.AI - Firebase Chatbot with Firestore Storage")
print("=" * 80)

# ============================================================================
# FIREBASE CONFIGURATION
# ============================================================================

FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": "mindneoxai",
    "private_key_id": "293ccc9c52358b9307cecd938aa46c62b6f1edbe",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC721KRE7h8pbTg\ntOQfJrHPSSNtIoek4hK/g9ERpJTiRypooeqS843NYp7FVq3CkYqSQthRSldwhl9p\nDeOZ/j1nip10Wi36qJknMN7mlLzva8+m6a3fkZmr2orGpG712bUaJAK5y/uIu0+k\ndjI2d/AOkr9pntyqfrUVGgp4r1VfWSZyDlIT/4FnQMs/ulwkdpEcjEIoY8kMeMYR\nUz2mTcLxQEAfWJBO+I/9Y1REbAy+mkZwXSCTPsVYS3jkGNjPvS7QjbIK/xiJojJX\nP1RvYZV0otciuvy2M1T9ZyTvlvV848SevioUXtV2Ws0B5UgRfV8gw62nrcq1n3/P\nEK5wkQqdAgMBAAECggEAI+i7QjcqU01bo36AgsHjSFPbPT/V/PsoCUrZuo0i1pQy\n85hL3jZHO2ToI6G7ik9G1UmIzxUuXLia4VqB0MxsEXBKQ9T/KAR1bivl197DtOJ/\naZEOpwdOgC7Ay1LgUQeCGlKa4Mgwt0TS5wWe+JF5pld/1mFDHiYlWDjHmqUtZRGy\nCKgUgva9KGAV1k+ApaIvtDkoo7vaSCT8Q4hAxABpze2RBcFE0KZXgUFhpwvtx9nA\nEHDry26ia+jcKRB/3FUG9lSzk+gBGE15NCdfUjxs9OIaTnNSpDbdYrTTrTOngwzR\nFa3f1Y9zREyZDERdvgUmUAZwsczHcnXgk6onGM43wwKBgQDpu7ZtTqAd22DVHEn4\n4Zpq9j4fRorSgcjxWnFtytMBV25jVkoN4QoY09lRgofvxSwfqOjpazH57hWtM6KX\nXwRsLDsnrJNEfgKWK958wBTemwPJ81zpLIp8KV2XzQPFvLnVcSvpk5+wk9Iv/C8s\ncFIk31IeX+O3RyA+lXTNRUWgzwKBgQDNwMXpl78K9Ui3pnOLuuDc1J5y4zofA26a\nqHb97EYB1NlaV4i4RwUdU+x3/AbwIlcxx4vVY1LBx2Nf5WAN8ow/LQor8k7UuUTT\nxUXmQLM+PxHh4dBY4h9rVfq6Y0vSr25WfMngOXvdgAy6oqy3xA2+Qy+E9LDYAwhk\nwr5o0VqA0wKBgQDKHP8IEGhWySA3yEmTBIsCGULoypg6pe37/qh9N1k1HMSg87n/\nvGx9wZt3Z3di985K5kXZqk9B/wYRisf7OzfYznqsuQdzv78+2lp+555kTAl/tYjP\nPSvXZ/G91ZOAhszva/h796KsD3c+9URZmhr+NXqON37zOncAhz7ETjWCcwKBgQDB\n+tvcZgdkMmpzUoefFfoH2KDl2dqjAJ5XSzqcHRTHhz/AD8TDT5m/066eVErKPOYN\n9X6dGL4eGXhUIbHUlHaq3TC4zAKMRXthWJyU/yy+I8IdPsMp+U376RywewsyP9j7\nyzycnDVuV9ooX1QNENaQKVF0vSi5Durr7DqOIcp8pwKBgQCGOF7mcTLiVYo5kSY4\nymtkLU7gOfHbUZge8W+w+FmyLLHyk1FJepoL+T12qiuiIkECyuW0sqM+QQ7Hsvvu\n0LLRyQUOh5mSmZb1lxx8w+J53j/E1PqrhLCrz8htByDF0lKpX7vdbS4QP/A+Noi/\n+MCTZ7gpwQByUCABOeDJtxZesQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@mindneoxai.iam.gserviceaccount.com",
    "client_id": "110466204946871204408",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40mindneoxai.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

# ============================================================================
# INITIALIZE FIREBASE
# ============================================================================

print("\n🔗 Connecting to Firebase Firestore...")
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(FIREBASE_CONFIG)
        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
    firebase_enabled = True
    print("✅ Firebase Firestore connected!")
    print(f"   Project: {FIREBASE_CONFIG['project_id']}")
    print("   Stateless storage (no login required)")
except Exception as e:
    print(f"❌ Firebase connection failed: {e}")
    print("\n⚠️  Please update FIREBASE_CONFIG with your service account key")
    print("   Get it from: Firebase Console → Project Settings → Service Accounts")
    exit(1)

# ============================================================================
# LOAD AI MODEL
# ============================================================================

print("\n🤖 Loading Mistral-7B AI Model...")
try:
    llm = LlamaCpp(
        model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
        n_ctx=4096,
        n_threads=4,
        n_gpu_layers=50,  # Use GPU if available (Mac Metal/NVIDIA/AMD)
        temperature=0.7,
        top_p=0.95,
        repeat_penalty=1.2,
        max_tokens=500,
        verbose=False
    )
    print("✅ AI Model loaded successfully!")
except Exception as e:
    print(f"❌ Model loading failed: {e}")
    print("\n⚠️  Make sure 'Mistral-7B-Instruct-v0.3.Q4_K_M.gguf' exists in current directory")
    exit(1)

# Load embedding model for semantic search
print("\n🔤 Loading embedding model for search...")
try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Embedding model loaded!")
except Exception as e:
    print(f"⚠️  Embedding model failed: {e}")
    embedding_model = None

# ============================================================================
# FIREBASE STORAGE FUNCTIONS
# ============================================================================

def store_in_firebase(user_message: str, assistant_response: str, metadata: dict = None) -> str:
    """
    Store conversation in Firebase Firestore (stateless, no login required)
    
    Structure:
        conversations/{chatID}/
            ├── timestamp: "2025-11-08T10:00:00Z"
            ├── model_used: "mindneox-v1"
            ├── messages: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]
            ├── embedding_id: "emb_abc123"
            ├── embedding_status: "stored"
            └── metadata: {...additional data...}
    """
    try:
        # Auto-generate unique chat ID
        chat_id = str(uuid.uuid4())
        
        # Generate embedding ID
        embedding_id = None
        if embedding_model:
            try:
                combined_text = f"User: {user_message}\nAssistant: {assistant_response}"
                embedding = embedding_model.encode(combined_text).tolist()
                embedding_id = f"emb_{hashlib.md5(combined_text.encode()).hexdigest()[:8]}"
            except:
                pass
        
        # Create conversation document
        conversation_data = {
            'timestamp': datetime.now().isoformat(),
            'model_used': 'mindneox-v1',  # Mistral 7B
            'messages': [
                {
                    'role': 'user',
                    'content': user_message,
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'role': 'assistant',
                    'content': assistant_response,
                    'timestamp': datetime.now().isoformat(),
                    'word_count': len(assistant_response.split()),
                    'char_count': len(assistant_response)
                }
            ],
            'embedding_id': embedding_id if embedding_id else None,
            'embedding_status': 'stored' if embedding_id else 'not_stored',
            'metadata': metadata if metadata else {}
        }
        
        # Store in Firestore: conversations/{chatID}
        db.collection('conversations').document(chat_id).set(conversation_data)
        
        return chat_id
        
    except Exception as e:
        print(f"\n⚠️  Firebase storage failed: {e}")
        return None


def search_conversations(query: str, limit: int = 5) -> list:
    """
    Search for conversations in Firestore
    Returns matching conversations sorted by relevance
    """
    try:
        print(f"\n🔍 Searching Firestore for: '{query}'")
        
        # Get all conversations (for small datasets)
        # For large datasets, use Firestore queries or Algolia integration
        conversations_ref = db.collection('conversations')
        
        # Search by keyword in messages
        results = []
        docs = conversations_ref.limit(100).stream()  # Limit to recent 100
        
        query_lower = query.lower()
        for doc in docs:
            data = doc.to_dict()
            
            # Check if query matches user message or assistant response
            for msg in data.get('messages', []):
                if query_lower in msg.get('content', '').lower():
                    results.append({
                        'id': doc.id,
                        'timestamp': data.get('timestamp'),
                        'messages': data.get('messages'),
                        'model_used': data.get('model_used')
                    })
                    break
        
        return results[:limit]
        
    except Exception as e:
        print(f"❌ Search failed: {e}")
        return []


def get_recent_conversations(limit: int = 10) -> list:
    """Get recent conversations from Firestore"""
    try:
        conversations_ref = db.collection('conversations')
        docs = conversations_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).limit(limit).stream()
        
        conversations = []
        for doc in docs:
            data = doc.to_dict()
            conversations.append({
                'id': doc.id,
                'timestamp': data.get('timestamp'),
                'messages': data.get('messages'),
                'model_used': data.get('model_used')
            })
        
        return conversations
        
    except Exception as e:
        print(f"❌ Failed to get conversations: {e}")
        return []


def get_conversation_stats() -> dict:
    """Get statistics about stored conversations"""
    try:
        conversations_ref = db.collection('conversations')
        docs = list(conversations_ref.stream())
        
        total_conversations = len(docs)
        total_messages = sum(len(doc.to_dict().get('messages', [])) for doc in docs)
        
        return {
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'collection': 'conversations'
        }
        
    except Exception as e:
        print(f"❌ Stats failed: {e}")
        return {}


# ============================================================================
# CHATBOT FUNCTIONS
# ============================================================================

def ask_anything(question: str) -> str:
    """
    Universal Q&A function with Firebase storage
    Ask any question and get AI-powered answer
    """
    print(f"\n💬 Question: {question}")
    print("=" * 80)
    
    # Build prompt
    prompt = f"""[INST] You are a knowledgeable AI assistant. Answer this question clearly and accurately:

Question: {question}

Answer: [/INST]"""
    
    print("🤖 Generating answer...")
    
    try:
        # Generate response
        response = llm.invoke(prompt)
        response = response.strip()
        
        print(f"\n✅ Answer ({len(response.split())} words):")
        print("-" * 80)
        print(response)
        print("-" * 80)
        
        # Store in Firebase
        if firebase_enabled:
            chat_id = store_in_firebase(
                user_message=question,
                assistant_response=response,
                metadata={
                    'source': 'ask_anything',
                    'question_length': len(question),
                    'answer_length': len(response)
                }
            )
            if chat_id:
                print(f"\n✅ Saved to Firebase Firestore!")
                print(f"   Chat ID: {chat_id[:8]}...")
                print(f"   Collection: conversations")
        
        return response
    
    except Exception as e:
        error_msg = f"Error: {str(e)}"
        print(f"❌ {error_msg}")
        return error_msg


def interactive_chat():
    """Interactive chat mode with Firebase storage"""
    print("\n" + "=" * 80)
    print("💬 INTERACTIVE CHAT MODE")
    print("=" * 80)
    print("\n🤖 Hi! I'm Mindneox.ai, your AI assistant!")
    print("\n📝 Commands:")
    print("   • Type your message to chat")
    print("   • Type 'search <query>' to search conversations")
    print("   • Type 'recent' to see recent conversations")
    print("   • Type 'stats' to see statistics")
    print("   • Type 'quit' or 'exit' to end chat")
    print("\n" + "=" * 80)
    
    conversation_count = 0
    
    while True:
        try:
            user_input = input("\n👤 You: ").strip()
            
            if not user_input:
                continue
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("\n👋 Goodbye! Thanks for chatting!")
                print(f"📊 Total conversations: {conversation_count}")
                break
            
            # Search command
            if user_input.lower().startswith('search '):
                query = user_input[7:].strip()
                results = search_conversations(query)
                
                if results:
                    print(f"\n📚 Found {len(results)} matching conversations:")
                    for i, conv in enumerate(results, 1):
                        print(f"\n{i}. Chat ID: {conv['id'][:8]}...")
                        print(f"   Time: {conv['timestamp']}")
                        for msg in conv['messages'][:2]:  # Show first 2 messages
                            print(f"   {msg['role'].title()}: {msg['content'][:100]}...")
                else:
                    print("\n❌ No matching conversations found")
                continue
            
            # Recent conversations
            if user_input.lower() == 'recent':
                conversations = get_recent_conversations()
                if conversations:
                    print(f"\n📚 Recent {len(conversations)} conversations:")
                    for i, conv in enumerate(conversations, 1):
                        print(f"\n{i}. Chat ID: {conv['id'][:8]}...")
                        print(f"   Time: {conv['timestamp']}")
                        user_msg = next((m for m in conv['messages'] if m['role'] == 'user'), None)
                        if user_msg:
                            print(f"   Question: {user_msg['content'][:80]}...")
                else:
                    print("\n❌ No conversations found")
                continue
            
            # Stats command
            if user_input.lower() == 'stats':
                stats = get_conversation_stats()
                print("\n📊 Firebase Firestore Statistics:")
                print("=" * 80)
                print(f"   Total Conversations: {stats.get('total_conversations', 0)}")
                print(f"   Total Messages: {stats.get('total_messages', 0)}")
                print(f"   Collection: {stats.get('collection', 'conversations')}")
                print("=" * 80)
                continue
            
            # Generate response
            print("\n🤖 Mindneox.ai: ", end="", flush=True)
            
            start = datetime.now()
            response = llm.invoke(f"[INST] {user_input} [/INST]")
            duration = (datetime.now() - start).total_seconds()
            
            response = response.strip()
            print(response)
            
            print(f"\n⚡ Response time: {duration:.2f}s")
            
            # Store in Firebase
            chat_id = store_in_firebase(
                user_message=user_input,
                assistant_response=response,
                metadata={
                    'source': 'interactive_chat',
                    'response_time': duration
                }
            )
            
            if chat_id:
                print(f"✅ Saved to Firebase! (ID: {chat_id[:8]}...)")
                conversation_count += 1
        
        except KeyboardInterrupt:
            print("\n\n👋 Chat interrupted. Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")


# ============================================================================
# MAIN MENU
# ============================================================================

def main():
    """Main menu for Firebase chatbot"""
    
    print("\n" + "=" * 80)
    print("🔥 FIREBASE CHATBOT - MAIN MENU")
    print("=" * 80)
    print("\nChoose an option:")
    print("   1. Ask a single question")
    print("   2. Interactive chat mode")
    print("   3. Search conversations")
    print("   4. View recent conversations")
    print("   5. View statistics")
    print("   6. Exit")
    print("=" * 80)
    
    while True:
        choice = input("\nEnter choice (1-6): ").strip()
        
        if choice == '1':
            question = input("\n💬 Ask a question: ").strip()
            if question:
                ask_anything(question)
            print("\n" + "=" * 80)
        
        elif choice == '2':
            interactive_chat()
            print("\n" + "=" * 80)
        
        elif choice == '3':
            query = input("\n🔍 Enter search query: ").strip()
            if query:
                results = search_conversations(query)
                if results:
                    print(f"\n📚 Found {len(results)} matching conversations:")
                    for i, conv in enumerate(results, 1):
                        print(f"\n{i}. Chat ID: {conv['id'][:8]}...")
                        print(f"   Time: {conv['timestamp']}")
                        for msg in conv['messages']:
                            print(f"   {msg['role'].title()}: {msg['content'][:150]}...")
                else:
                    print("\n❌ No matching conversations found")
            print("\n" + "=" * 80)
        
        elif choice == '4':
            conversations = get_recent_conversations()
            if conversations:
                print(f"\n📚 Recent {len(conversations)} conversations:")
                for i, conv in enumerate(conversations, 1):
                    print(f"\n{i}. Chat ID: {conv['id'][:8]}...")
                    print(f"   Time: {conv['timestamp']}")
                    print(f"   Model: {conv.get('model_used', 'N/A')}")
                    for msg in conv['messages']:
                        print(f"   {msg['role'].title()}: {msg['content'][:100]}...")
            else:
                print("\n❌ No conversations found")
            print("\n" + "=" * 80)
        
        elif choice == '5':
            stats = get_conversation_stats()
            print("\n📊 Firebase Firestore Statistics:")
            print("=" * 80)
            print(f"   Total Conversations: {stats.get('total_conversations', 0)}")
            print(f"   Total Messages: {stats.get('total_messages', 0)}")
            print(f"   Collection: {stats.get('collection', 'conversations')}")
            print(f"   Project: {FIREBASE_CONFIG['project_id']}")
            print("=" * 80)
        
        elif choice == '6':
            print("\n👋 Goodbye! Thanks for using Firebase Chatbot!")
            break
        
        else:
            print("❌ Invalid choice. Please enter 1-6.")


# ============================================================================
# RUN
# ============================================================================

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Program interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
