#!/usr/bin/env python3
"""
Automatic Backup System for Mindnex.ai
Continuously monitors and backs up data to Google Drive
"""

import json
import os
import time
import redis
import hashlib
from datetime import datetime
from typing import Dict, List

GOOGLE_DRIVE_FOLDER_ID = "1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"
BACKUP_INTERVAL = 300  # 5 minutes
LOCAL_BACKUP_DIR = "backups"


class DataCollector:
    """Collects all data for backup"""
    
    def __init__(self):
        self.redis_client = None
        self.connect_redis()
        self.ensure_backup_dir()
    
    def ensure_backup_dir(self):
        """Create backup directory if not exists"""
        if not os.path.exists(LOCAL_BACKUP_DIR):
            os.makedirs(LOCAL_BACKUP_DIR)
            print(f"✅ Created backup directory: {LOCAL_BACKUP_DIR}")
    
    def connect_redis(self):
        """Connect to Redis"""
        try:
            self.redis_client = redis.Redis(
                host='localhost', 
                port=6379, 
                db=0, 
                decode_responses=True
            )
            self.redis_client.ping()
            return True
        except:
            return False
    
    def collect_all_data(self) -> Dict:
        """Collect all system data"""
        
        data = {
            "backup_metadata": {
                "timestamp": datetime.now().isoformat(),
                "platform": "Mindnex.ai",
                "model": "Mistral-7B-Instruct-v0.3",
                "version": "1.0"
            },
            "cache_data": self.collect_cache_data(),
            "responses": self.collect_responses(),
            "statistics": self.collect_statistics()
        }
        
        return data
    
    def collect_cache_data(self) -> List[Dict]:
        """Collect all cached responses"""
        if not self.redis_client:
            return []
        
        cache_data = []
        
        try:
            keys = list(self.redis_client.keys('*'))
            
            for key in keys:
                try:
                    key_type = self.redis_client.type(key)
                    
                    item = {
                        "cache_key": key,
                        "type": key_type,
                        "created_at": datetime.now().isoformat()
                    }
                    
                    if key_type == 'hash':
                        hash_data = self.redis_client.hgetall(key)
                        item['raw_data'] = hash_data
                        
                        # Parse LangChain response
                        if '0' in hash_data:
                            try:
                                parsed = json.loads(hash_data['0'])
                                if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                                    item['response_text'] = parsed['kwargs']['text']
                                    item['response_length'] = len(parsed['kwargs']['text'])
                            except:
                                pass
                    
                    elif key_type == 'string':
                        item['data'] = self.redis_client.get(key)
                    
                    # TTL
                    ttl = self.redis_client.ttl(key)
                    item['ttl'] = ttl if ttl > 0 else None
                    
                    cache_data.append(item)
                    
                except Exception as e:
                    print(f"⚠️  Error processing key {key}: {e}")
                    continue
            
        except Exception as e:
            print(f"❌ Error collecting cache: {e}")
        
        return cache_data
    
    def collect_responses(self) -> List[Dict]:
        """Collect formatted responses"""
        if not self.redis_client:
            return []
        
        responses = []
        
        try:
            keys = list(self.redis_client.keys('*'))
            
            for key in keys:
                try:
                    key_type = self.redis_client.type(key)
                    
                    if key_type == 'hash':
                        hash_data = self.redis_client.hgetall(key)
                        
                        if '0' in hash_data:
                            try:
                                parsed = json.loads(hash_data['0'])
                                
                                if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                                    response = {
                                        "id": key,
                                        "timestamp": datetime.now().isoformat(),
                                        "text": parsed['kwargs']['text'],
                                        "word_count": len(parsed['kwargs']['text'].split()),
                                        "char_count": len(parsed['kwargs']['text']),
                                        "type": parsed.get('id', ['unknown'])[2] if 'id' in parsed else 'unknown'
                                    }
                                    
                                    responses.append(response)
                            except:
                                pass
                
                except Exception as e:
                    continue
        
        except Exception as e:
            print(f"❌ Error collecting responses: {e}")
        
        return responses
    
    def collect_statistics(self) -> Dict:
        """Collect system statistics"""
        if not self.redis_client:
            return {}
        
        stats = {
            "collection_time": datetime.now().isoformat(),
            "total_keys": 0,
            "key_types": {},
            "total_responses": 0,
            "total_words": 0,
            "total_characters": 0
        }
        
        try:
            keys = list(self.redis_client.keys('*'))
            stats["total_keys"] = len(keys)
            
            for key in keys:
                try:
                    key_type = self.redis_client.type(key)
                    stats["key_types"][key_type] = stats["key_types"].get(key_type, 0) + 1
                    
                    # Count words and chars
                    if key_type == 'hash':
                        hash_data = self.redis_client.hgetall(key)
                        if '0' in hash_data:
                            try:
                                parsed = json.loads(hash_data['0'])
                                if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                                    text = parsed['kwargs']['text']
                                    stats["total_responses"] += 1
                                    stats["total_words"] += len(text.split())
                                    stats["total_characters"] += len(text)
                            except:
                                pass
                
                except:
                    continue
            
            # Calculate averages
            if stats["total_responses"] > 0:
                stats["avg_words_per_response"] = stats["total_words"] / stats["total_responses"]
                stats["avg_chars_per_response"] = stats["total_characters"] / stats["total_responses"]
        
        except Exception as e:
            print(f"❌ Error collecting statistics: {e}")
        
        return stats
    
    def save_to_file(self, data: Dict, filename: str = None) -> str:
        """Save data to JSON file"""
        
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{LOCAL_BACKUP_DIR}/mindnex_backup_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        file_size = os.path.getsize(filename)
        
        return filename


def create_consolidated_export():
    """Create a single comprehensive export file"""
    
    print("\n" + "="*70)
    print("📦 CREATING CONSOLIDATED DATA EXPORT")
    print("="*70)
    
    collector = DataCollector()
    
    if not collector.redis_client:
        print("❌ Cannot connect to Redis. Start it with:")
        print("  brew services start redis")
        return None
    
    # Collect all data
    print("\n📊 Collecting all data...")
    all_data = collector.collect_all_data()
    
    print(f"✅ Collected {len(all_data['cache_data'])} cache items")
    print(f"✅ Collected {len(all_data['responses'])} responses")
    print(f"✅ Statistics: {all_data['statistics']['total_keys']} total keys")
    
    # Save to file
    print("\n💾 Saving to file...")
    filename = collector.save_to_file(all_data)
    
    file_size = os.path.getsize(filename)
    print(f"✅ Saved to: {filename}")
    print(f"📊 File size: {file_size / 1024:.2f} KB")
    
    return filename


def create_responses_only_export():
    """Create export with only the response text (cleaner)"""
    
    print("\n📝 Creating responses-only export...")
    
    collector = DataCollector()
    
    if not collector.redis_client:
        return None
    
    export_data = {
        "metadata": {
            "export_date": datetime.now().isoformat(),
            "platform": "Mindnex.ai",
            "description": "LLM Generated Responses",
            "model": "Mistral-7B-Instruct-v0.3"
        },
        "responses": collector.collect_responses(),
        "statistics": collector.collect_statistics()
    }
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{LOCAL_BACKUP_DIR}/responses_only_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    file_size = os.path.getsize(filename)
    print(f"✅ Saved: {filename} ({file_size / 1024:.2f} KB)")
    
    return filename


def create_daily_summary():
    """Create a daily summary report"""
    
    collector = DataCollector()
    
    if not collector.redis_client:
        return None
    
    stats = collector.collect_statistics()
    
    summary = {
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "report_time": datetime.now().strftime("%H:%M:%S"),
        "summary": {
            "total_cached_items": stats.get("total_keys", 0),
            "total_responses_generated": stats.get("total_responses", 0),
            "total_words_generated": stats.get("total_words", 0),
            "total_characters": stats.get("total_characters", 0),
            "average_response_length": {
                "words": round(stats.get("avg_words_per_response", 0), 2),
                "characters": round(stats.get("avg_chars_per_response", 0), 2)
            }
        },
        "cache_breakdown": stats.get("key_types", {}),
        "storage_info": {
            "redis_location": "localhost:6379",
            "backup_location": LOCAL_BACKUP_DIR,
            "google_drive_folder": GOOGLE_DRIVE_FOLDER_ID
        }
    }
    
    timestamp = datetime.now().strftime("%Y%m%d")
    filename = f"{LOCAL_BACKUP_DIR}/daily_summary_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    print(f"✅ Daily summary: {filename}")
    
    return filename


def main():
    """Main menu"""
    
    print("\n" + "="*70)
    print("💾 MINDNEX.AI - DATA BACKUP & EXPORT SYSTEM")
    print("="*70)
    
    print("\n📋 Export Options:")
    print("  1. Complete data export (everything)")
    print("  2. Responses only (clean format)")
    print("  3. Daily summary report")
    print("  4. All three exports")
    print("  5. List existing backups")
    print("  6. Exit")
    
    choice = input("\nSelect option (1-6): ").strip()
    
    if choice == '1':
        filename = create_consolidated_export()
        if filename:
            print(f"\n✅ Export complete: {filename}")
            print(f"\n📤 To upload to Google Drive:")
            print(f"  python google_drive_export.py")
    
    elif choice == '2':
        filename = create_responses_only_export()
        if filename:
            print(f"\n✅ Export complete: {filename}")
    
    elif choice == '3':
        filename = create_daily_summary()
        if filename:
            print(f"\n✅ Summary created: {filename}")
    
    elif choice == '4':
        print("\n📦 Creating all exports...")
        file1 = create_consolidated_export()
        file2 = create_responses_only_export()
        file3 = create_daily_summary()
        
        print("\n" + "="*70)
        print("✅ ALL EXPORTS COMPLETE!")
        print("="*70)
        print(f"\n1. Complete: {file1}")
        print(f"2. Responses: {file2}")
        print(f"3. Summary: {file3}")
        
        print(f"\n📤 To upload all to Google Drive:")
        print(f"  python google_drive_export.py")
        print(f"  (Select option 5 to upload existing JSON files)")
    
    elif choice == '5':
        # List backups
        if os.path.exists(LOCAL_BACKUP_DIR):
            files = [f for f in os.listdir(LOCAL_BACKUP_DIR) if f.endswith('.json')]
            if files:
                print(f"\n📁 Found {len(files)} backup files:")
                for i, f in enumerate(sorted(files, reverse=True), 1):
                    size = os.path.getsize(os.path.join(LOCAL_BACKUP_DIR, f))
                    print(f"  {i}. {f} ({size / 1024:.2f} KB)")
            else:
                print("\n📭 No backup files found")
        else:
            print("\n📭 Backup directory doesn't exist yet")
    
    elif choice == '6':
        print("👋 Goodbye!")
        return
    
    else:
        print("❌ Invalid choice")


if __name__ == "__main__":
    main()
