#!/usr/bin/env python3
"""
Pinecone Quick Start Examples
Common operations with your Pinecone index
"""

from pinecone import Pinecone, ServerlessSpec
import time

# Configuration
API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
INDEX_NAME = "quickstart"  # Change this to your index name


def example_1_connect():
    """Example 1: Connect to your index"""
    
    print("\n" + "="*70)
    print("EXAMPLE 1: Connect to Pinecone Index")
    print("="*70)
    
    # Initialize Pinecone
    pc = Pinecone(api_key=API_KEY)
    
    # Connect to index
    index = pc.Index(INDEX_NAME)
    
    print(f"✅ Connected to index: {INDEX_NAME}")
    
    return pc, index


def example_2_create_index():
    """Example 2: Create a new index"""
    
    print("\n" + "="*70)
    print("EXAMPLE 2: Create New Index")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    
    # Check if index already exists
    existing = [idx.name for idx in pc.list_indexes()]
    
    if INDEX_NAME in existing:
        print(f"ℹ️  Index '{INDEX_NAME}' already exists")
        index = pc.Index(INDEX_NAME)
    else:
        print(f"📝 Creating new index: {INDEX_NAME}")
        
        # Create serverless index
        pc.create_index(
            name=INDEX_NAME,
            dimension=384,  # For sentence-transformers/all-MiniLM-L6-v2
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'
            )
        )
        
        # Wait for index to be ready
        while not pc.describe_index(INDEX_NAME).status['ready']:
            print("   ⏳ Waiting for index to be ready...")
            time.sleep(1)
        
        print(f"✅ Index '{INDEX_NAME}' created!")
        index = pc.Index(INDEX_NAME)
    
    return pc, index


def example_3_upsert_vectors():
    """Example 3: Insert/update vectors"""
    
    print("\n" + "="*70)
    print("EXAMPLE 3: Upsert Vectors")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Example vectors (384 dimensions)
    # In practice, use embeddings from sentence-transformers
    import random
    
    vectors = [
        {
            'id': 'vec1',
            'values': [random.random() for _ in range(384)],
            'metadata': {
                'topic': 'photosynthesis',
                'age_level': 12,
                'text': 'Photosynthesis is how plants make food...'
            }
        },
        {
            'id': 'vec2',
            'values': [random.random() for _ in range(384)],
            'metadata': {
                'topic': 'solar system',
                'age_level': 10,
                'text': 'The solar system has 8 planets...'
            }
        }
    ]
    
    # Upsert vectors
    index.upsert(vectors=vectors)
    
    print(f"✅ Upserted {len(vectors)} vectors")
    
    # Wait a moment for indexing
    time.sleep(1)
    
    # Check stats
    stats = index.describe_index_stats()
    print(f"📊 Total vectors in index: {stats['total_vector_count']}")


def example_4_query():
    """Example 4: Query vectors"""
    
    print("\n" + "="*70)
    print("EXAMPLE 4: Query Vectors")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Create query vector (in practice, use embeddings)
    import random
    query_vector = [random.random() for _ in range(384)]
    
    # Query for similar vectors
    results = index.query(
        vector=query_vector,
        top_k=3,
        include_metadata=True
    )
    
    print(f"🔍 Query results ({len(results['matches'])} matches):\n")
    
    for i, match in enumerate(results['matches'], 1):
        print(f"  {i}. ID: {match['id']}")
        print(f"     Score: {match['score']:.4f}")
        if match.get('metadata'):
            print(f"     Topic: {match['metadata'].get('topic', 'N/A')}")
            print(f"     Text: {match['metadata'].get('text', 'N/A')[:50]}...")
        print()


def example_5_fetch():
    """Example 5: Fetch specific vectors by ID"""
    
    print("\n" + "="*70)
    print("EXAMPLE 5: Fetch Vectors by ID")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Fetch specific vectors
    result = index.fetch(ids=['vec1', 'vec2'])
    
    print(f"📥 Fetched {len(result['vectors'])} vectors:\n")
    
    for vec_id, vec_data in result['vectors'].items():
        print(f"  ID: {vec_id}")
        if 'metadata' in vec_data:
            print(f"  Topic: {vec_data['metadata'].get('topic', 'N/A')}")
        print()


def example_6_delete():
    """Example 6: Delete vectors"""
    
    print("\n" + "="*70)
    print("EXAMPLE 6: Delete Vectors")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Delete specific vectors
    index.delete(ids=['vec1'])
    
    print("🗑️  Deleted vector: vec1")
    
    # Or delete all vectors (use with caution!)
    # index.delete(delete_all=True)


def example_7_stats():
    """Example 7: Get index statistics"""
    
    print("\n" + "="*70)
    print("EXAMPLE 7: Index Statistics")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    index = pc.Index(INDEX_NAME)
    
    # Get stats
    stats = index.describe_index_stats()
    
    print(f"📊 Index Statistics:")
    print(f"   Total vectors: {stats['total_vector_count']}")
    print(f"   Dimension: {stats.get('dimension', 'N/A')}")
    print(f"   Index fullness: {stats.get('index_fullness', 0):.2%}")
    
    if 'namespaces' in stats and stats['namespaces']:
        print(f"\n   Namespaces:")
        for ns, ns_stats in stats['namespaces'].items():
            print(f"     - {ns}: {ns_stats['vector_count']} vectors")


def example_8_list_indexes():
    """Example 8: List all indexes"""
    
    print("\n" + "="*70)
    print("EXAMPLE 8: List All Indexes")
    print("="*70)
    
    pc = Pinecone(api_key=API_KEY)
    
    # List all indexes
    indexes = pc.list_indexes()
    
    print(f"📋 You have {len(indexes)} index(es):\n")
    
    for idx in indexes:
        print(f"  • {idx.name}")
        print(f"    Dimension: {idx.dimension}")
        print(f"    Metric: {idx.metric}")
        print(f"    Host: {idx.host}")
        print()


def main():
    """Run all examples"""
    
    print("\n" + "="*70)
    print("📌 PINECONE QUICKSTART EXAMPLES")
    print("="*70)
    print(f"\nAPI Key: {API_KEY[:20]}...")
    print(f"Index: {INDEX_NAME}")
    
    try:
        # Example 1: Connect
        pc, index = example_1_connect()
        
        # Example 2: Create index (if needed)
        # pc, index = example_2_create_index()
        
        # Example 7: Stats
        example_7_stats()
        
        # Example 8: List indexes
        example_8_list_indexes()
        
        # Uncomment to run other examples:
        # example_3_upsert_vectors()
        # example_4_query()
        # example_5_fetch()
        # example_6_delete()
        
        print("\n" + "="*70)
        print("✅ Examples complete!")
        print("="*70)
        print("\n💡 Edit this file to run different examples")
        print("   Uncomment the examples you want to try")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Make sure:")
        print(f"   1. Index '{INDEX_NAME}' exists")
        print("   2. API key is correct")
        print("   3. You're connected to internet")


if __name__ == "__main__":
    main()
