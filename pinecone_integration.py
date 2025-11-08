#!/usr/bin/env python3
"""
Pinecone Vector Database Integration for Mindnex.ai
Store and retrieve AI responses using semantic search
"""

import os
from datetime import datetime
from typing import List, Dict, Any
import json

# Pinecone imports
try:
    from pinecone.grpc import PineconeGRPC as Pinecone
    from pinecone import ServerlessSpec
    PINECONE_AVAILABLE = True
except ImportError:
    try:
        from pinecone import Pinecone, ServerlessSpec
        PINECONE_AVAILABLE = True
    except ImportError:
        PINECONE_AVAILABLE = False
        print("⚠️  Pinecone not installed. Run: pip install pinecone-client")

# LangChain imports
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Pinecone as LangChainPinecone

# Redis for caching
import redis

# Configuration
PINECONE_API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
PINECONE_ENVIRONMENT = "us-east-1"  # Default serverless region
INDEX_NAME = "mindnex-responses"

# Model paths
MODEL_PATH = "/Users/yeduruabhiram/Desktop/llm testing /Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"


class MindnexVectorDB:
    """Mindnex.ai with Pinecone Vector Database"""
    
    def __init__(self):
        """Initialize Pinecone and LLM"""
        
        if not PINECONE_AVAILABLE:
            raise ImportError("Pinecone not installed. Run: pip install pinecone-client")
        
        print("\n" + "="*70)
        print("🚀 INITIALIZING MINDNEX.AI WITH PINECONE VECTOR DATABASE")
        print("="*70)
        
        # Initialize Pinecone
        print("\n📌 Connecting to Pinecone...")
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Create or connect to index
        self.setup_index()
        
        # Initialize embeddings (for vector conversion)
        print("\n🔤 Loading embedding model...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        print("   ✅ Embeddings ready (384 dimensions)")
        
        # Initialize LLM
        print("\n🤖 Loading Mistral-7B model...")
        self.llm = LlamaCpp(
            model_path=MODEL_PATH,
            n_gpu_layers=50,
            n_ctx=4096,
            temperature=0.7,
            max_tokens=500,
            verbose=False
        )
        print("   ✅ LLM ready")
        
        # Connect to Redis
        try:
            self.redis_client = redis.Redis(
                host='localhost', 
                port=6379, 
                db=0, 
                decode_responses=True
            )
            self.redis_client.ping()
            print("\n💾 Connected to Redis cache")
        except:
            self.redis_client = None
            print("\n⚠️  Redis not available (caching disabled)")
        
        print("\n✅ Mindnex.ai with Pinecone is ready!")
    
    def setup_index(self):
        """Create or connect to Pinecone index"""
        
        # Check if index exists
        existing_indexes = [index.name for index in self.pc.list_indexes()]
        
        if INDEX_NAME not in existing_indexes:
            print(f"   📝 Creating new index: {INDEX_NAME}")
            
            # Create serverless index
            self.pc.create_index(
                name=INDEX_NAME,
                dimension=384,  # all-MiniLM-L6-v2 dimensions
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-east-1'
                )
            )
            print(f"   ✅ Index '{INDEX_NAME}' created")
        else:
            print(f"   ✅ Connected to existing index: {INDEX_NAME}")
        
        # Connect to index
        self.index = self.pc.Index(INDEX_NAME)
        
        # Get index stats
        stats = self.index.describe_index_stats()
        print(f"   📊 Index stats: {stats['total_vector_count']} vectors")
    
    def generate_response(self, topic: str, age: int = 12) -> str:
        """Generate AI response using LLM"""
        
        prompt_template = PromptTemplate(
            input_variables=["topic", "age"],
            template="""You are an expert educator. Explain {topic} in a clear, 
engaging way suitable for a {age}-year-old student. Use simple language, 
examples, and analogies. Keep it concise but informative.

Explanation:"""
        )
        
        prompt = prompt_template.format(topic=topic, age=age)
        response = self.llm.invoke(prompt)
        
        return response.strip()
    
    def store_response(
        self, 
        topic: str, 
        response: str, 
        age: int = 12,
        metadata: Dict[str, Any] = None
    ) -> str:
        """Store response in Pinecone vector database"""
        
        print(f"\n💾 Storing response in Pinecone...")
        
        # Generate embedding for the response
        embedding = self.embeddings.embed_query(response)
        
        # Create unique ID
        vector_id = f"response_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(topic) % 10000}"
        
        # Prepare metadata
        meta = {
            'topic': topic,
            'age': age,
            'response': response,
            'word_count': len(response.split()),
            'character_count': len(response),
            'timestamp': datetime.now().isoformat(),
            'response_preview': response[:200]
        }
        
        if metadata:
            meta.update(metadata)
        
        # Store in Pinecone
        self.index.upsert(
            vectors=[{
                'id': vector_id,
                'values': embedding,
                'metadata': meta
            }]
        )
        
        print(f"   ✅ Stored with ID: {vector_id}")
        
        # Also cache in Redis
        if self.redis_client:
            cache_key = f"pinecone:{vector_id}"
            self.redis_client.set(cache_key, json.dumps(meta))
            print(f"   ✅ Cached in Redis: {cache_key}")
        
        return vector_id
    
    def semantic_search(
        self, 
        query: str, 
        top_k: int = 5,
        filter_dict: Dict = None
    ) -> List[Dict]:
        """Search for similar responses using semantic search"""
        
        print(f"\n🔍 Searching for: '{query}'")
        
        # Generate embedding for query
        query_embedding = self.embeddings.embed_query(query)
        
        # Search in Pinecone
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict
        )
        
        # Format results
        formatted_results = []
        
        print(f"\n📊 Found {len(results['matches'])} similar responses:")
        
        for i, match in enumerate(results['matches'], 1):
            result = {
                'id': match['id'],
                'score': match['score'],
                'topic': match['metadata'].get('topic', 'Unknown'),
                'response': match['metadata'].get('response', ''),
                'word_count': match['metadata'].get('word_count', 0),
                'timestamp': match['metadata'].get('timestamp', ''),
                'age': match['metadata'].get('age', 0)
            }
            
            formatted_results.append(result)
            
            print(f"\n   {i}. Topic: {result['topic']}")
            print(f"      Similarity: {result['score']:.4f}")
            print(f"      Age level: {result['age']} years")
            print(f"      Preview: {result['response'][:100]}...")
        
        return formatted_results
    
    def ask_and_store(self, topic: str, age: int = 12) -> Dict:
        """Generate response and store in vector database"""
        
        print("\n" + "="*70)
        print(f"📚 TOPIC: {topic}")
        print(f"👤 AGE: {age} years")
        print("="*70)
        
        # Generate response
        print("\n🤖 Generating response...")
        response = self.generate_response(topic, age)
        
        print(f"\n✅ Generated response ({len(response.split())} words):")
        print("-" * 70)
        print(response)
        print("-" * 70)
        
        # Store in vector database
        vector_id = self.store_response(topic, response, age)
        
        return {
            'id': vector_id,
            'topic': topic,
            'age': age,
            'response': response,
            'word_count': len(response.split()),
            'timestamp': datetime.now().isoformat()
        }
    
    def find_similar_topics(self, topic: str, top_k: int = 3) -> List[Dict]:
        """Find similar topics we've explained before"""
        
        print(f"\n🔍 Finding topics similar to: '{topic}'")
        
        # Search using the topic as query
        results = self.semantic_search(topic, top_k=top_k)
        
        return results
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        
        print("\n" + "="*70)
        print("📊 PINECONE DATABASE STATISTICS")
        print("="*70)
        
        # Get index stats
        stats = self.index.describe_index_stats()
        
        info = {
            'total_vectors': stats['total_vector_count'],
            'index_name': INDEX_NAME,
            'dimensions': 384,
            'metric': 'cosine',
            'namespaces': stats.get('namespaces', {})
        }
        
        print(f"\n📌 Index: {info['index_name']}")
        print(f"📊 Total responses stored: {info['total_vectors']}")
        print(f"🔢 Vector dimensions: {info['dimensions']}")
        print(f"📏 Similarity metric: {info['metric']}")
        
        return info
    
    def delete_response(self, vector_id: str):
        """Delete a response from vector database"""
        
        print(f"\n🗑️  Deleting response: {vector_id}")
        
        self.index.delete(ids=[vector_id])
        
        # Also delete from Redis cache
        if self.redis_client:
            cache_key = f"pinecone:{vector_id}"
            self.redis_client.delete(cache_key)
        
        print("   ✅ Deleted successfully")


def demo():
    """Demo of Pinecone integration"""
    
    print("\n" + "="*70)
    print("🎓 MINDNEX.AI - PINECONE VECTOR DATABASE DEMO")
    print("="*70)
    
    # Initialize
    db = MindnexVectorDB()
    
    # Example 1: Generate and store a response
    print("\n\n" + "="*70)
    print("EXAMPLE 1: Generate and Store Response")
    print("="*70)
    
    result = db.ask_and_store("photosynthesis", age=12)
    
    # Example 2: Semantic search
    print("\n\n" + "="*70)
    print("EXAMPLE 2: Semantic Search")
    print("="*70)
    
    similar = db.semantic_search("how do plants make food?", top_k=3)
    
    # Example 3: Find similar topics
    print("\n\n" + "="*70)
    print("EXAMPLE 3: Find Similar Topics")
    print("="*70)
    
    topics = db.find_similar_topics("plant biology", top_k=3)
    
    # Example 4: Get statistics
    stats = db.get_stats()
    
    print("\n" + "="*70)
    print("✅ DEMO COMPLETE!")
    print("="*70)


def interactive_mode():
    """Interactive mode for Pinecone database"""
    
    db = MindnexVectorDB()
    
    while True:
        print("\n" + "="*70)
        print("📋 PINECONE VECTOR DATABASE - MENU")
        print("="*70)
        
        print("\n1. Generate and store new response")
        print("2. Search for similar responses")
        print("3. Find similar topics")
        print("4. View database statistics")
        print("5. Delete a response")
        print("6. Exit")
        
        choice = input("\nSelect option (1-6): ").strip()
        
        if choice == '1':
            topic = input("\n📚 Enter topic: ").strip()
            age = input("👤 Enter age (default 12): ").strip()
            age = int(age) if age else 12
            
            result = db.ask_and_store(topic, age)
        
        elif choice == '2':
            query = input("\n🔍 Enter search query: ").strip()
            top_k = input("📊 Number of results (default 5): ").strip()
            top_k = int(top_k) if top_k else 5
            
            results = db.semantic_search(query, top_k=top_k)
        
        elif choice == '3':
            topic = input("\n📚 Enter topic: ").strip()
            top_k = input("📊 Number of similar topics (default 3): ").strip()
            top_k = int(top_k) if top_k else 3
            
            similar = db.find_similar_topics(topic, top_k=top_k)
        
        elif choice == '4':
            stats = db.get_stats()
        
        elif choice == '5':
            vector_id = input("\n🔑 Enter vector ID to delete: ").strip()
            db.delete_response(vector_id)
        
        elif choice == '6':
            print("\n👋 Goodbye!")
            break
        
        else:
            print("\n❌ Invalid choice")


def main():
    """Main entry point"""
    
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'demo':
            demo()
        elif sys.argv[1] == 'interactive':
            interactive_mode()
        elif sys.argv[1] == 'stats':
            db = MindnexVectorDB()
            db.get_stats()
        else:
            print("Usage:")
            print("  python pinecone_integration.py demo         # Run demo")
            print("  python pinecone_integration.py interactive  # Interactive mode")
            print("  python pinecone_integration.py stats        # Show statistics")
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
