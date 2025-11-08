#!/usr/bin/env python3
"""
One-Click Export to JSON - Ready for Google Drive
"""

import json
import os
import redis
from datetime import datetime

print("="*70)
print("📤 QUICK EXPORT - Mindnex.ai Data to JSON")
print("="*70)

# Connect to Redis
try:
    r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
    r.ping()
    print("✅ Connected to Redis\n")
except:
    print("❌ Redis not running. Start with: brew services start redis")
    exit(1)

# Create backups folder
if not os.path.exists('backups'):
    os.makedirs('backups')

# Collect all data
print("📊 Collecting all responses...")

all_data = {
    "exported_on": datetime.now().isoformat(),
    "platform": "Mindnex.ai",
    "model": "Mistral-7B-Instruct-v0.3",
    "google_drive_folder": "1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf",
    "responses": []
}

keys = list(r.keys('*'))
print(f"Found {len(keys)} cached items\n")

for i, key in enumerate(keys, 1):
    try:
        key_type = r.type(key)
        
        if key_type == 'hash':
            hash_data = r.hgetall(key)
            
            if '0' in hash_data:
                try:
                    parsed = json.loads(hash_data['0'])
                    
                    if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                        response = {
                            "id": f"response_{i}",
                            "cache_key": key,
                            "timestamp": datetime.now().isoformat(),
                            "response_text": parsed['kwargs']['text'],
                            "word_count": len(parsed['kwargs']['text'].split()),
                            "character_count": len(parsed['kwargs']['text'])
                        }
                        
                        all_data['responses'].append(response)
                        print(f"✓ Exported response {i}")
                except:
                    pass
    except:
        continue

# Save to file
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
filename = f"backups/mindnex_data_{timestamp}.json"

with open(filename, 'w', encoding='utf-8') as f:
    json.dump(all_data, f, indent=2, ensure_ascii=False)

file_size = os.path.getsize(filename)

print("\n" + "="*70)
print("✅ EXPORT COMPLETE!")
print("="*70)
print(f"\n📁 File: {filename}")
print(f"📊 Size: {file_size / 1024:.2f} KB")
print(f"📝 Responses: {len(all_data['responses'])}")

print("\n" + "="*70)
print("📤 NEXT STEP: Upload to Google Drive")
print("="*70)
print("\nOption 1 - Manual Upload (Easy):")
print("  1. Open: https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf")
print(f"  2. Upload file: {filename}")
print("  3. Done! ✅")

print("\nOption 2 - Automatic Upload:")
print("  python google_drive_export.py")
print("  (Requires setup - see GOOGLE_DRIVE_SETUP.md)")

print("\n" + "="*70)
