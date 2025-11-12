#!/usr/bin/env python3
"""
View and manage cached LLM responses from Redis
"""
import redis
import json
from datetime import datetime

def connect_redis():
    """Connect to Redis server"""
    try:
        client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        client.ping()
        return client
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("\nTo start Redis, run:")
        print("  brew services start redis")
        print("  OR")
        print("  redis-server")
        return None

def view_all_cache():
    """View all cached data in Redis"""
    client = connect_redis()
    if not client:
        return
    
    # Get all LangChain cache keys
    keys = client.keys('*')
    
    if not keys:
        print("📭 No cached data found in Redis")
        return
    
    print(f"\n📦 Found {len(keys)} cached items:\n")
    print("=" * 80)
    
    for i, key in enumerate(keys, 1):
        print(f"\n🔑 Key {i}: {key}")
        
        # Get value
        value = client.get(key)
        
        # Get TTL (time to live)
        ttl = client.ttl(key)
        ttl_str = f"{ttl} seconds" if ttl > 0 else "No expiration"
        
        print(f"⏱️  TTL: {ttl_str}")
        print(f"📄 Content:")
        print("-" * 80)
        
        # Try to parse as JSON, otherwise print raw
        try:
            data = json.loads(value)
            print(json.dumps(data, indent=2))
        except:
            # If it's a long response, truncate for display
            if len(value) > 500:
                print(value[:500] + "... (truncated)")
                print(f"\n📏 Full length: {len(value)} characters")
            else:
                print(value)
        
        print("=" * 80)

def clear_cache():
    """Clear all cached data"""
    client = connect_redis()
    if not client:
        return
    
    keys = client.keys('*')
    if not keys:
        print("📭 No cached data to clear")
        return
    
    confirm = input(f"⚠️  Are you sure you want to delete {len(keys)} cached items? (yes/no): ")
    if confirm.lower() == 'yes':
        for key in keys:
            client.delete(key)
        print(f"✅ Cleared {len(keys)} cached items")
    else:
        print("❌ Cancelled")

def search_cache(search_term):
    """Search for cached data containing a term"""
    client = connect_redis()
    if not client:
        return
    
    keys = client.keys('*')
    found = []
    
    for key in keys:
        value = client.get(key)
        if search_term.lower() in value.lower() or search_term.lower() in key.lower():
            found.append((key, value))
    
    if not found:
        print(f"🔍 No results found for '{search_term}'")
        return
    
    print(f"\n🔍 Found {len(found)} results for '{search_term}':\n")
    print("=" * 80)
    
    for key, value in found:
        print(f"\n🔑 Key: {key}")
        print(f"📄 Content: {value[:200]}..." if len(value) > 200 else f"📄 Content: {value}")
        print("=" * 80)

def main():
    """Main menu"""
    print("\n" + "=" * 80)
    print("🗄️  LLM Cache Viewer - Redis Edition")
    print("=" * 80)
    
    while True:
        print("\nOptions:")
        print("  1. View all cached data")
        print("  2. Search cache")
        print("  3. Clear all cache")
        print("  4. Check Redis status")
        print("  5. Exit")
        
        choice = input("\nEnter choice (1-5): ").strip()
        
        if choice == '1':
            view_all_cache()
        elif choice == '2':
            search_term = input("Enter search term: ").strip()
            search_cache(search_term)
        elif choice == '3':
            clear_cache()
        elif choice == '4':
            client = connect_redis()
            if client:
                info = client.info('stats')
                print(f"\n✅ Redis is running!")
                print(f"📊 Total keys: {client.dbsize()}")
                print(f"📈 Total commands: {info.get('total_commands_processed', 'N/A')}")
        elif choice == '5':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

if __name__ == "__main__":
    main()
