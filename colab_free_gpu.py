# Mindneox.ai - Free GPU Testing on Google Colab
# ================================================
# Upload this file to Google Colab and run each cell
# Enable GPU: Runtime → Change runtime type → GPU → Save

# ==============================================================================
# CELL 1: Check GPU Availability
# ==============================================================================
import torch
print("=" * 60)
print("🔍 GPU Status Check")
print("=" * 60)
print(f"\nCUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
    print(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    print(f"CUDA Version: {torch.version.cuda}")
    print("\n🎉 FREE GPU IS READY!")
else:
    print("\n❌ Enable GPU: Runtime → Change runtime type → GPU → Save")

# ==============================================================================
# CELL 2: Install Dependencies (~3 minutes)
# ==============================================================================
!pip install -q llama-cpp-python langchain langchain-core langchain-community
!pip install -q redis pinecone-client sentence-transformers transformers accelerate
print("\n✅ All dependencies installed!")

# ==============================================================================
# CELL 3: Download Mistral-7B Model (~2 minutes)
# ==============================================================================
import os
MODEL_FILE = "Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"
MODEL_URL = "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"

if not os.path.exists(MODEL_FILE):
    print(f"📥 Downloading {MODEL_FILE}...")
    print("⏱️  This will take about 2 minutes (4.37 GB)\n")
    !wget --show-progress {MODEL_URL}
    
    # Verify download
    if os.path.exists(MODEL_FILE):
        print(f"\n✅ Downloaded! Size: {os.path.getsize(MODEL_FILE) / 1024**3:.2f} GB")
    else:
        print("\n❌ Download failed! Trying alternative method...")
        !curl -L -o {MODEL_FILE} {MODEL_URL}
        if os.path.exists(MODEL_FILE):
            print(f"✅ Downloaded with curl! Size: {os.path.getsize(MODEL_FILE) / 1024**3:.2f} GB")
        else:
            print("❌ Download failed. Please check internet connection and try again.")
else:
    print(f"✅ Model exists! Size: {os.path.getsize(MODEL_FILE) / 1024**3:.2f} GB")

# ==============================================================================
# CELL 4: Setup Pinecone
# ==============================================================================
from pinecone import Pinecone
from langchain_community.embeddings import HuggingFaceEmbeddings

PINECONE_API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
INDEX_NAME = "mindnex-responses"

try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    pinecone_index = pc.Index(INDEX_NAME)
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cuda'}
    )
    stats = pinecone_index.describe_index_stats()
    print(f"✅ Pinecone connected! Vectors: {stats['total_vector_count']}")
except Exception as e:
    print(f"⚠️  Pinecone error: {e}")
    pinecone_index = None
    embeddings = None

# ==============================================================================
# CELL 5: Load Model on GPU
# ==============================================================================
from llama_cpp import Llama
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from datetime import datetime

llm = LlamaCpp(
    model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
    n_ctx=8192,
    n_threads=2,
    n_gpu_layers=-1,  # ALL layers on GPU
    n_batch=512,
    temperature=0.7,
    top_p=0.95,
    repeat_penalty=1.2,
    max_tokens=500,
    verbose=False
)

prompt_template = PromptTemplate(
    input_variables=["topic", "age"],
    template="[INST] Explain {topic} in detail for a {age} year old to understand. [/INST]"
)
chain = prompt_template | llm
print("✅ Model loaded on GPU! Expected speed: 40-60 tokens/sec")

# ==============================================================================
# CELL 6: Helper Functions
# ==============================================================================
def store_in_pinecone(topic: str, response: str, age: str):
    if not pinecone_index or not embeddings:
        return None
    try:
        embedding = embeddings.embed_query(response)
        vector_id = f"response_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(topic) % 10000}"
        metadata = {
            'topic': topic,
            'age': int(age) if age.isdigit() else 12,
            'response': response,
            'word_count': len(response.split()),
            'timestamp': datetime.now().isoformat(),
            'device': 'cuda',
            'gpu_model': torch.cuda.get_device_name(0),
            'platform': 'Google Colab Free'
        }
        pinecone_index.upsert(vectors=[{'id': vector_id, 'values': embedding, 'metadata': metadata}])
        print(f"✅ Stored in Pinecone: {vector_id}")
        return vector_id
    except Exception as e:
        print(f"⚠️  Error: {e}")
        return None

def generate_text(topic: str, age: str):
    try:
        print(f"\n🚀 Generating: {topic} (age {age})")
        start_time = datetime.now()
        response = chain.invoke({"topic": topic, "age": age})
        duration = (datetime.now() - start_time).total_seconds()
        tokens = len(response.split())
        tokens_per_sec = tokens / duration if duration > 0 else 0
        print(f"⚡ {tokens} tokens in {duration:.2f}s = {tokens_per_sec:.1f} tok/s")
        if pinecone_index and embeddings:
            store_in_pinecone(topic, response, age)
        return response, tokens_per_sec
    except Exception as e:
        return f"Error: {e}", 0

print("✅ Functions defined!")

# ==============================================================================
# CELL 7: Run Benchmark
# ==============================================================================
print("\n" + "=" * 60)
print("🏃 BENCHMARK TEST")
print("=" * 60)
response, speed = generate_text("Machine Learning", "25")
print(f"\n📊 Speed: {speed:.1f} tokens/sec")
print(f"🎉 ~10x faster than Mac (5-10 tok/s)!")
print(f"\n--- RESPONSE ---\n{response}")

# ==============================================================================
# CELL 8: Interactive Mode
# ==============================================================================
print("\n" + "=" * 60)
print("💬 Interactive Mode")
print("=" * 60)
topic = input("\nEnter topic: ")
age = input("Enter age: ")
response, speed = generate_text(topic, age)
print(f"\n📊 Speed: {speed:.1f} tokens/sec on FREE GPU")
print(f"\n--- RESPONSE ---\n{response}")

if pinecone_index:
    stats = pinecone_index.describe_index_stats()
    print(f"\n✅ Total vectors: {stats['total_vector_count']}")

# ==============================================================================
# CELL 9: GPU Stats
# ==============================================================================
if torch.cuda.is_available():
    print("\n" + "=" * 60)
    print("📊 GPU Usage")
    print("=" * 60)
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"Total VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
    print(f"Allocated: {torch.cuda.memory_allocated(0) / 1024**3:.2f} GB")
    print(f"Cached: {torch.cuda.memory_reserved(0) / 1024**3:.2f} GB")
    print("\n🔥 Using FREE T4 GPU - No cost!")
    !nvidia-smi
