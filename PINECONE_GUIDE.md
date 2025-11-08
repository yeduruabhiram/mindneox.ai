# 📌 Pinecone Vector Database Integration Guide

Complete guide to using Pinecone with Mindnex.ai for semantic search and RAG.

---

## 🚀 Quick Start

### 1. Install Pinecone

```bash
pip install pinecone-client
pip install sentence-transformers
```

### 2. Run Basic Integration

```bash
python pinecone_integration.py
```

### 3. Try Advanced RAG

```bash
python pinecone_rag.py demo
```

---

## 📦 What's Included

### Files Created:

1. **pinecone_integration.py** - Basic Pinecone integration
   - Store AI responses with embeddings
   - Semantic search
   - Find similar topics
   - Database statistics

2. **pinecone_rag.py** - Advanced RAG system
   - Document chunking
   - Retrieval Augmented Generation
   - Question answering
   - Context-aware responses

3. **requirements_pinecone.txt** - All dependencies

---

## 🔑 Your Pinecone API Key

```
API Key: pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh
Region: us-east-1 (AWS Serverless)
Index Name: mindnex-responses (basic) / mindnex-knowledge (advanced)
```

---

## 📊 Features

### Basic Integration (`pinecone_integration.py`)

#### Store Responses
```python
from pinecone_integration import MindnexVectorDB

db = MindnexVectorDB()
result = db.ask_and_store("photosynthesis", age=12)
```

#### Semantic Search
```python
# Find similar responses
results = db.semantic_search("how do plants make food?", top_k=5)

# Each result includes:
# - Similarity score (0-1)
# - Original topic
# - Full response text
# - Metadata (age, word count, timestamp)
```

#### Find Similar Topics
```python
similar = db.find_similar_topics("plant biology", top_k=3)
```

### Advanced RAG (`pinecone_rag.py`)

#### Add Educational Content
```python
from pinecone_rag import AdvancedMindnexRAG

rag = AdvancedMindnexRAG()
rag.add_educational_content(
    topic="Solar System",
    content="The Solar System consists of...",
    age_level=12,
    category="astronomy"
)
```

#### Ask Questions (RAG)
```python
# Retrieves relevant context and generates answer
result = rag.rag_query("How many planets are in our solar system?")

print(result['answer'])
print(f"Used {result['num_sources']} sources")
```

#### Semantic Search with Filters
```python
results = rag.semantic_search(
    query="space exploration",
    k=5,
    filter_dict={'category': 'astronomy', 'age_level': 12}
)
```

---

## 🎮 Usage Modes

### Interactive Mode (Default)
```bash
python pinecone_integration.py
```

Menu options:
1. Generate and store new response
2. Search for similar responses
3. Find similar topics
4. View database statistics
5. Delete a response
6. Exit

### Demo Mode
```bash
python pinecone_integration.py demo
```

Runs complete demo:
- Generates and stores response
- Performs semantic search
- Finds similar topics
- Shows statistics

### Statistics Mode
```bash
python pinecone_integration.py stats
```

Shows database stats:
- Total vectors stored
- Index information
- Dimensions and metrics

### RAG Demo
```bash
python pinecone_rag.py rag
```

Demonstrates:
- Adding educational content
- Question answering with context
- Source attribution

---

## 🔍 How It Works

### 1. Embeddings

Uses `sentence-transformers/all-MiniLM-L6-v2`:
- 384-dimensional vectors
- Fast and efficient
- Works on CPU
- Trained on semantic similarity

### 2. Vector Storage

Stores in Pinecone:
```
Response Text → Embedding Model → 384D Vector → Pinecone Index
```

Metadata stored with each vector:
- Topic
- Age level
- Word count
- Timestamp
- Category
- Full response text

### 3. Semantic Search

```
Query → Embedding → Search Pinecone → Top K Similar Vectors
```

Returns results ranked by cosine similarity (0-1):
- 1.0 = identical
- 0.9+ = very similar
- 0.7-0.9 = related
- <0.7 = less related

### 4. RAG (Retrieval Augmented Generation)

```
Question → Retrieve Relevant Docs → Build Context → LLM Generates Answer
```

Advantages:
- Answers based on your stored knowledge
- Reduces hallucinations
- Cites sources
- More accurate responses

---

## 📈 Example Workflow

### Daily Usage:

1. **Morning: Generate content**
   ```bash
   python pinecone_integration.py
   ```
   
   - Add topics: "quantum physics", "machine learning", etc.
   - Responses automatically stored with embeddings

2. **Search for related content**
   ```python
   db.semantic_search("how does AI learn?", top_k=5)
   ```
   
   Finds all related content even if exact words don't match!

3. **Ask complex questions**
   ```bash
   python pinecone_rag.py
   ```
   
   - "What's the relationship between photosynthesis and climate?"
   - System retrieves relevant docs and generates comprehensive answer

### Building Knowledge Base:

```python
# Add multiple topics
topics = [
    "photosynthesis",
    "solar system",
    "water cycle",
    "cell division",
    "chemical reactions"
]

for topic in topics:
    db.ask_and_store(topic, age=12)
```

Now you can:
- Search semantically across all topics
- Find connections between concepts
- Ask questions that span multiple topics

---

## 🎯 Use Cases

### 1. Personal Knowledge Base
Store all your learning materials and query them semantically.

### 2. Educational Tutor
Build a library of explanations at different age levels, retrieve the most relevant ones.

### 3. Study Assistant
Ask questions and get answers based on your stored notes and explanations.

### 4. Research Tool
Store research papers (chunked), find related content across your entire database.

### 5. Content Creation
Find similar topics you've written about before, maintain consistency.

---

## 📊 Database Statistics

### View Stats:
```bash
python pinecone_integration.py stats
```

Shows:
- Total vectors: Number of stored responses/chunks
- Index name: Your Pinecone index
- Dimensions: 384 (embedding size)
- Metric: Cosine similarity

### Monitor Growth:
```python
db = MindnexVectorDB()
stats = db.get_stats()

print(f"Total responses: {stats['total_vectors']}")
```

---

## 🔧 Advanced Features

### Custom Metadata Filtering

```python
# Search only physics content for 12-year-olds
results = rag.semantic_search(
    query="energy and motion",
    k=5,
    filter_dict={
        'category': 'physics',
        'age_level': 12
    }
)
```

### Document Chunking

Large documents automatically split into chunks:
```python
rag.add_document(
    text="Long educational content...",
    metadata={'source': 'textbook', 'chapter': 5}
)
```

Chunks overlap (50 chars) to maintain context.

### Batch Operations

```python
# Add multiple topics efficiently
topics = ["topic1", "topic2", "topic3"]
for topic in topics:
    db.ask_and_store(topic)
```

---

## 💾 Data Persistence

### Where Data is Stored:

1. **Pinecone Cloud** (Primary)
   - All vectors and metadata
   - Persistent across sessions
   - Accessible from anywhere

2. **Redis Cache** (Secondary)
   - Fast local access
   - Query cache
   - Temporary storage

### Backup Strategy:

```python
# Pinecone data is automatically backed up
# Export for local backup:
python quick_csv_export.py  # Exports to CSV
python quick_export.py      # Exports to JSON
```

---

## 🐛 Troubleshooting

### "Pinecone not installed"
```bash
pip install pinecone-client
```

### "Import error: sentence-transformers"
```bash
pip install sentence-transformers
```

### "Index not found"
The scripts automatically create indexes on first run.

### "Connection timeout"
Check internet connection. Pinecone requires network access.

### "Out of quota"
Free tier limits:
- 100K vectors
- 1 index
- Upgrade at pinecone.io if needed

### Slow embedding generation
First run downloads the model (~90MB). Subsequent runs are fast.

---

## 📊 Performance

### Embedding Speed:
- ~50-100 vectors/second on CPU
- ~500+ vectors/second on GPU

### Search Speed:
- <100ms for most queries
- Scales to millions of vectors

### Storage:
- Each vector: ~1.5KB (384 dims × 4 bytes)
- 1000 responses ≈ 1.5MB
- Metadata stored separately

---

## 🎓 Example Scripts

### Script 1: Build Knowledge Base
```python
from pinecone_integration import MindnexVectorDB

db = MindnexVectorDB()

# Science topics
science_topics = [
    "photosynthesis", "evolution", "gravity",
    "atoms", "ecosystems", "energy conservation"
]

for topic in science_topics:
    print(f"\nAdding: {topic}")
    db.ask_and_store(topic, age=12)

print(f"\n✅ Added {len(science_topics)} topics!")
db.get_stats()
```

### Script 2: Smart Search
```python
# Search semantically
query = "how living things get energy"

results = db.semantic_search(query, top_k=3)

print(f"\nTop {len(results)} related topics:")
for i, r in enumerate(results, 1):
    print(f"{i}. {r['topic']} (similarity: {r['score']:.3f})")
    print(f"   {r['response'][:100]}...")
```

### Script 3: RAG Q&A
```python
from pinecone_rag import AdvancedMindnexRAG

rag = AdvancedMindnexRAG()

# Add content
rag.add_educational_content(
    topic="Climate Change",
    content="""Climate change refers to long-term shifts in 
    global temperatures and weather patterns...""",
    age_level=14,
    category="environmental_science"
)

# Ask questions
answer = rag.rag_query("What causes climate change?")
print(answer['answer'])
```

---

## 🔗 Integration with Existing System

### Works with:
- ✅ Redis caching (automatic)
- ✅ Mistral-7B LLM (uses same model)
- ✅ CSV export (export vector data too)
- ✅ Google Drive backup (metadata included)

### Enhanced Features:
- Semantic search across all responses
- Find related topics automatically
- Build knowledge graphs
- Context-aware answers

---

## 📚 Additional Resources

### Pinecone Documentation:
- https://docs.pinecone.io/

### Sentence Transformers:
- https://www.sbert.net/

### LangChain Pinecone:
- https://python.langchain.com/docs/integrations/vectorstores/pinecone

---

## ✅ Quick Command Reference

```bash
# Basic integration
python pinecone_integration.py              # Interactive mode
python pinecone_integration.py demo         # Demo
python pinecone_integration.py stats        # Statistics

# Advanced RAG
python pinecone_rag.py                      # Interactive mode
python pinecone_rag.py demo                 # Basic demo
python pinecone_rag.py rag                  # RAG demo
python pinecone_rag.py stats                # Statistics

# Install dependencies
pip install pinecone-client sentence-transformers

# View stored data
python quick_view.py                        # Redis cache
python pinecone_integration.py stats        # Pinecone vectors
```

---

## 🎉 You're Ready!

Your Pinecone vector database is configured and ready to use!

**Next steps:**
1. Install: `pip install pinecone-client sentence-transformers`
2. Run: `python pinecone_integration.py demo`
3. Explore: Try semantic search on your responses
4. Build: Create your knowledge base!

**Your API Key:** Already configured in the scripts ✅

For questions, see the troubleshooting section or check Pinecone docs.
