#!/usr/bin/env python3
"""
Quick script to view what's in Redis cache
"""
import redis
import sys

def main():
    try:
        # Connect to Redis
        r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        r.ping()
        print("✅ Connected to Redis\n")
        
        # Get all keys
        keys = list(r.keys('*'))
        
        if not keys:
            print("📭 Cache is empty - no data stored yet")
            return
        
        print(f"📦 Found {len(keys)} cached items:\n")
        print("=" * 80)
        
        for i, key in enumerate(keys, 1):
            # Check the type of the Redis key
            key_type = r.type(key)
            print(f"\n{i}. 🔑 Key: {key}")
            print(f"   🏷️  Type: {key_type}")
            
            try:
                if key_type == 'string':
                    value = r.get(key)
                    print(f"   📄 Value: {value[:150]}..." if len(value) > 150 else f"   📄 Value: {value}")
                elif key_type == 'hash':
                    value = r.hgetall(key)
                    print(f"   📄 Hash data: {value}")
                elif key_type == 'list':
                    value = r.lrange(key, 0, -1)
                    print(f"   📄 List data: {value}")
                elif key_type == 'set':
                    value = r.smembers(key)
                    print(f"   📄 Set data: {value}")
                elif key_type == 'zset':
                    value = r.zrange(key, 0, -1, withscores=True)
                    print(f"   📄 Sorted set data: {value}")
                else:
                    print(f"   ⚠️  Unknown type: {key_type}")
            except Exception as e:
                print(f"   ❌ Error reading value: {e}")
            
            print("-" * 80)
        
        # Option to clear cache
        print("\n💡 Options:")
        print("   - Press Enter to exit")
        print("   - Type 'clear' to delete all cache")
        choice = input("\nYour choice: ").strip().lower()
        
        if choice == 'clear':
            confirm = input("⚠️  Delete all cached data? (yes/no): ").strip().lower()
            if confirm == 'yes':
                for key in keys:
                    r.delete(key)
                print(f"✅ Deleted {len(keys)} cached items")
            else:
                print("❌ Cancelled")
            
    except redis.ConnectionError:
        print("❌ Cannot connect to Redis")
        print("\n💡 Start Redis first:")
        print("   brew services start redis")
        print("   OR")
        print("   redis-server")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
