"""
Mindneox.ai - NVIDIA GPU Optimized Version
===========================================
This version is optimized for NVIDIA GPUs with CUDA support.
Uses all GPU layers for maximum performance and lower temperatures.
"""

from llama_cpp import Llama
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache
from langchain_community.cache import RedisCache
import redis
import hashlib
from datetime import datetime
import torch

# Check CUDA availability
print("=" * 60)
print("🚀 Mindneox.ai - NVIDIA GPU Version")
print("=" * 60)
print("\n🔍 Checking GPU availability...")
if torch.cuda.is_available():
    print(f"✅ CUDA Available: {torch.cuda.is_available()}")
    print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
    print(f"✅ VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    print(f"✅ CUDA Version: {torch.version.cuda}")
else:
    print("⚠️  WARNING: CUDA not available! Will use CPU (slow)")
    print("💡 Install CUDA-enabled PyTorch:")
    print("   pip install torch --index-url https://download.pytorch.org/whl/cu121")

# Pinecone integration
try:
    from pinecone import Pinecone
    from langchain_community.embeddings import HuggingFaceEmbeddings
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

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
        
        # Initialize embeddings with GPU if available
        print("🔤 Loading embedding model...")
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': device}
        )
        print(f"✅ Embeddings using: {device.upper()}")
        
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
    print("💡 Install with: pip install pinecone-client sentence-transformers\n")

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

print("\n" + "=" * 60)
print("🚀 Loading Mistral-7B model with NVIDIA GPU acceleration")
print("=" * 60)

# GPU-optimized settings
if torch.cuda.is_available():
    # Use ALL GPU layers for NVIDIA GPUs
    n_gpu_layers = -1  # -1 means use all layers
    print(f"✅ GPU Mode: Using ALL model layers on GPU")
    print(f"✅ This will be MUCH faster than Mac!")
else:
    n_gpu_layers = 0
    print("⚠️  CPU Mode: No GPU acceleration (will be slow)")

llm = LlamaCpp(
    model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
    n_ctx=8192,  # Increased context size (was 4096 on Mac)
    n_threads=8,  # More threads for CPU fallback
    n_gpu_layers=n_gpu_layers,  # Use all GPU layers
    n_batch=512,  # Increased batch size for GPU
    temperature=0.7,
    top_p=0.95,
    repeat_penalty=1.2,
    max_tokens=500,  # Increased from 300
    verbose=False,
    # GPU-specific optimizations
    use_mlock=True,  # Keep model in RAM
    use_mmap=True,   # Memory-mapped file I/O
    n_gpu_layers_draft=0,  # No draft model
)

print("✅ Model loaded successfully!")
print(f"📊 Context size: 8192 tokens (2x Mac version)")
print(f"📊 Max output: 500 tokens (1.6x Mac version)")
print(f"🔥 Expected speed: 30-150 tokens/sec (vs 5-10 on Mac)\n")

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
        
        # Generate embedding (GPU-accelerated if available)
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
            'response_preview': response[:200],
            'device': 'cuda' if torch.cuda.is_available() else 'cpu',
            'gpu_model': torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'
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
        print("🚀 Generating response with GPU acceleration...")
        
        # Measure generation time
        start_time = datetime.now()
        
        # Use LangChain to generate response (caching is handled automatically by LangChain)
        response = chain.invoke({"topic": topic, "age": age})
        
        # Calculate tokens per second
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        tokens = len(response.split())
        tokens_per_sec = tokens / duration if duration > 0 else 0
        
        print(f"⚡ Generated {tokens} tokens in {duration:.2f}s ({tokens_per_sec:.1f} tokens/sec)")
        
        # Store in Pinecone if available
        if pinecone_index and embeddings:
            store_in_pinecone(topic, response, age)
        
        return response
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"Error: {str(e)}"


def run_benchmark():
    """Run a quick benchmark to test GPU performance"""
    print("\n" + "=" * 60)
    print("🏃 Running GPU Performance Benchmark")
    print("=" * 60)
    
    test_topic = "Machine Learning"
    test_age = "25"
    
    print(f"\nTest: Explain '{test_topic}' for age {test_age}")
    print("This will test your GPU performance...\n")
    
    start = datetime.now()
    response = generate_text(test_topic, test_age)
    duration = (datetime.now() - start).total_seconds()
    
    print("\n--- BENCHMARK RESULTS ---")
    print(f"⏱️  Total time: {duration:.2f} seconds")
    print(f"📝 Response length: {len(response)} characters")
    print(f"📊 Words generated: {len(response.split())}")
    print(f"⚡ Average speed: {len(response.split()) / duration:.1f} tokens/sec")
    
    if torch.cuda.is_available():
        print(f"🔥 GPU: {torch.cuda.get_device_name(0)}")
        print(f"💾 VRAM used: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
    
    print("\n" + "=" * 60)
    return response


if __name__ == "__main__":
    import sys
    
    # Check for benchmark flag
    if len(sys.argv) > 1 and sys.argv[1] == "--benchmark":
        run_benchmark()
        sys.exit(0)
    
    print("\n" + "=" * 60)
    print("💡 TIP: Run with --benchmark to test GPU performance")
    print("=" * 60 + "\n")
    
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
    
    # Show GPU stats at end
    if torch.cuda.is_available():
        print("\n" + "=" * 60)
        print("📊 GPU Statistics")
        print("=" * 60)
        print(f"GPU: {torch.cuda.get_device_name(0)}")
        print(f"VRAM Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
        print(f"VRAM Cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
        print(f"Temperature: Check with 'nvidia-smi'")
        print("=" * 60)
