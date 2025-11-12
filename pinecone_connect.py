#!/usr/bin/env python3
"""
Simple Pinecone Connection Example
Quick way to connect and interact with your Pinecone index
"""

from pinecone import Pinecone

# Your API key
API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"

# Index names (choose one or create your own)
INDEX_NAME = "mindnex-responses"  # Default index for Mindnex.ai
# INDEX_NAME = "quickstart"  # Or use your own index name

def connect():
    """Connect to Pinecone and return the index"""
    
    print("\n🔗 Connecting to Pinecone...")
    
    # Initialize Pinecone client
    pc = Pinecone(api_key=API_KEY)
    
    # List available indexes
    indexes = pc.list_indexes()
    print(f"📋 Available indexes: {[idx.name for idx in indexes]}")
    
    # Connect to index
    try:
        index = pc.Index(INDEX_NAME)
        print(f"✅ Connected to index: {INDEX_NAME}")
        
        # Get stats
        stats = index.describe_index_stats()
        print(f"📊 Total vectors: {stats['total_vector_count']}")
        print(f"📏 Dimensions: {stats.get('dimension', 'N/A')}")
        
        return pc, index
    
    except Exception as e:
        print(f"❌ Error connecting to index: {e}")
        print(f"\n💡 Available indexes: {[idx.name for idx in indexes]}")
        return pc, None


def main():
    """Main function to test connection"""
    
    print("\n" + "="*70)
    print("📌 PINECONE CONNECTION TEST")
    print("="*70)
    
    # Connect to Pinecone
    pc, index = connect()
    
    if index:
        print("\n✅ Connection successful!")
        print(f"\n📌 You can now use:")
        print(f"   pc = Pinecone(api_key='your_key')")
        print(f"   index = pc.Index('{INDEX_NAME}')")
        print(f"\n📖 See pinecone_integration.py for full examples")
    else:
        print("\n❌ Connection failed")
        print("\n💡 To create a new index:")
        print("   python pinecone_integration.py")
    
    return pc, index


if __name__ == "__main__":
    pc, index = main()
    
    # Now you can use pc and index objects
    # Example:
    # stats = index.describe_index_stats()
    # print(stats)
