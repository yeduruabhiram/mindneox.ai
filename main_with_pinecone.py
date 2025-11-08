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

print("=" * 60)
print("Educational Explainer (Mistral-7B + Pinecone)")
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


def generate_text(topic: str, age: str) -> str:
    """Generate text using Mistral-7B GGUF model with LangChain caching"""
    
    try:
        print("Generating response...")
        
        # Use LangChain to generate response (caching is handled automatically by LangChain)
        response = chain.invoke({"topic": topic, "age": age})
        
        # Store in Pinecone if available
        if pinecone_index and embeddings:
            store_in_pinecone(topic, response, age)
        
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
    
    if pinecone_index:
        print("\n" + "="*60)
        print("✅ Response saved to:")
        print("   • Redis cache (for fast retrieval)")
        print("   • Pinecone vector database (for semantic search)")
        print("\n💡 Search for similar responses:")
        print("   python pinecone_integration.py")
        print("="*60)
