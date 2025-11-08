from llama_cpp import Llama
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache
from langchain_community.cache import RedisCache
import redis
import hashlib
from datetime import datetime

# Pinecone integration
try:
    from pinecone import Pinecone
    from langchain_community.embeddings import HuggingFaceEmbeddings
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

# Firebase integration
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    import uuid
    FIREBASE_AVAILABLE = True
except ImportError:
    FIREBASE_AVAILABLE = False

print("=" * 60)
print("Educational Explainer (Mistral-7B + Pinecone + Firebase)")
print("=" * 60)

# Initialize Pinecone (if available)
pinecone_index = None
embeddings = None

if PINECONE_AVAILABLE:
    try:
        print("\n🔗 Connecting to Pinecone...")
        PINECONE_API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
        INDEX_NAME = "mindnex-responses"
        
        pc = Pinecone(api_key=PINECONE_API_KEY)
        pinecone_index = pc.Index(INDEX_NAME)
        
        # Initialize embeddings
        print("🔤 Loading embedding model...")
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Check index stats
        stats = pinecone_index.describe_index_stats()
        print(f"✅ Pinecone connected! ({stats['total_vector_count']} vectors stored)\n")
    except Exception as e:
        print(f"⚠️  Pinecone connection failed: {e}")
        print("💾 Responses will only be cached in Redis.\n")
        pinecone_index = None
        embeddings = None
else:
    print("\n⚠️  Pinecone not installed. Responses will only be cached in Redis.")
    print("💡 Install with: pip install pinecone sentence-transformers\n")

# Initialize Firebase Firestore (if available)
firebase_db = None
firebase_enabled = False

if FIREBASE_AVAILABLE:
    try:
        print("\n🔗 Connecting to Firebase Firestore...")
        
        # Firebase configuration - UPDATE THIS WITH YOUR SERVICE ACCOUNT KEY
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
        
        # Check if Firebase is already initialized
        if not firebase_admin._apps:
            cred = credentials.Certificate(FIREBASE_CONFIG)
            firebase_admin.initialize_app(cred)
        
        firebase_db = firestore.client()
        firebase_enabled = True
        
        print(f"✅ Firebase connected! Project: {FIREBASE_CONFIG['project_id']}")
        print("✅ Stateless storage enabled (no login required)\n")
        
    except Exception as e:
        print(f"⚠️  Firebase connection failed: {e}")
        print("💾 Responses will be saved to Pinecone only.\n")
        firebase_db = None
        firebase_enabled = False
else:
    print("\n⚠️  Firebase not installed. Install with: pip install firebase-admin\n")

print("\nInitializing cache...")
try:
    redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    # Use Redis cache for persistent storage
    set_llm_cache(RedisCache(redis_client))
    print("✅ Redis cache connected! Data will persist across runs.\n")
except Exception as e:
    print(f"⚠️  Redis connection failed: {e}")
    print("💾 Using in-memory cache (data will be lost when program ends).\n")
    set_llm_cache(InMemoryCache())
    redis_client = None

print("\nLoading Mistral-7B model (GGUF quantized)...")
print("This uses Apple Silicon GPU acceleration!\n")

llm = LlamaCpp(
    model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
    n_ctx=4096,
    n_threads=4,
    n_gpu_layers=50,
    temperature=0.7,
    top_p=0.95,
    repeat_penalty=1.2,
    max_tokens=300,
    verbose=False
)

print("Model loaded successfully!\n")

# Create prompt template with LangChain
prompt_template = PromptTemplate(
    input_variables=["topic", "age"],
    template="[INST] Explain {topic} in detail for a {age} year old to understand. [/INST]"
)

# Create chain using LCEL (LangChain Expression Language)
chain = prompt_template | llm


def store_in_pinecone(topic: str, response: str, age: str):
    """Store response in Pinecone vector database"""
    
    if not pinecone_index or not embeddings:
        return None
    
    try:
        print("\n💾 Storing in Pinecone...")
        
        # Generate embedding
        embedding = embeddings.embed_query(response)
        
        # Create unique ID
        vector_id = f"response_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(topic) % 10000}"
        
        # Prepare metadata
        metadata = {
            'topic': topic,
            'age': int(age) if age.isdigit() else 12,
            'response': response,
            'word_count': len(response.split()),
            'character_count': len(response),
            'timestamp': datetime.now().isoformat(),
            'response_preview': response[:200]
        }
        
        # Store in Pinecone
        pinecone_index.upsert(
            vectors=[{
                'id': vector_id,
                'values': embedding,
                'metadata': metadata
            }]
        )
        
        print(f"   ✅ Stored in Pinecone with ID: {vector_id}")
        
        # Also cache in Redis
        if redis_client:
            cache_key = f"pinecone:{vector_id}"
            redis_client.set(cache_key, str(metadata))
            print(f"   ✅ Cached in Redis: {cache_key}")
        
        return vector_id
    
    except Exception as e:
        print(f"   ⚠️  Pinecone storage failed: {e}")
        return None


def store_in_firebase(topic: str, response: str, age: str, embedding_id: str | None = None):
    """Store response in Firebase Firestore (no login required)"""
    
    if not firebase_enabled or not firebase_db:
        return None
    
    try:
        print("\n🔥 Storing in Firebase...")
        
        # Auto-generate unique chat ID
        chat_id = str(uuid.uuid4())
        
        # Create conversation document
        conversation_data = {
            'timestamp': datetime.now().isoformat(),
            'model_used': 'mindneox-v1',  # Mistral 7B
            'messages': [
                {
                    'role': 'user',
                    'content': f"Explain {topic} for a {age} year old",
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'role': 'assistant',
                    'content': response,
                    'timestamp': datetime.now().isoformat(),
                    'word_count': len(response.split()),
                    'char_count': len(response)
                }
            ],
            'embedding_id': embedding_id if embedding_id else None,
            'embedding_status': 'stored' if embedding_id else 'not_stored',
            'metadata': {
                'source': 'educational_explainer',
                'topic': topic,
                'age': int(age) if age.isdigit() else 12
            }
        }
        
        # Store in Firestore: conversations/{chatID}
        firebase_db.collection('conversations').document(chat_id).set(conversation_data)
        
        print(f"   ✅ Stored in Firebase with ID: {chat_id[:8]}...")
        
        return chat_id
        
    except Exception as e:
        print(f"   ⚠️  Firebase storage failed: {e}")
        return None


def generate_text(topic: str, age: str) -> str:
    """Generate text using Mistral-7B GGUF model with LangChain caching"""
    
    try:
        print("Generating response...")
        
        # Use LangChain to generate response (caching is handled automatically by LangChain)
        response = chain.invoke({"topic": topic, "age": age})
        
        # Store in Pinecone if available
        embedding_id = None
        if pinecone_index and embeddings:
            embedding_id = store_in_pinecone(topic, response, age)
        
        # Store in Firebase if available
        if firebase_enabled and firebase_db:
            store_in_firebase(topic, response, age, embedding_id)
        
        return response
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"Error: {str(e)}"


if __name__ == "__main__":
    topic = input("Enter topic: ")
    age = input("Enter age: ")
    text = generate_text(topic, age)
    print("\n--- MODEL OUTPUT ---\n")
    print(text)
    
    print("\n" + "="*60)
    print("✅ Response saved to:")
    if redis_client:
        print("   • Redis cache (for fast retrieval)")
    if pinecone_index:
        print("   • Pinecone vector database (for semantic search)")
    if firebase_enabled:
        print("   • Firebase Firestore (stateless storage, no login)")
    
    if pinecone_index or firebase_enabled:
        print("\n💡 Search for similar responses:")
        print("   python pinecone_integration.py")
    print("="*60)
