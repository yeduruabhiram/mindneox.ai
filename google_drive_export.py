#!/usr/bin/env python3
"""
Google Drive Integration for Mindnex.ai
Exports cache data and responses to Google Drive in JSON format
"""

import json
import os
import redis
from datetime import datetime
from typing import Dict, List, Any
import pickle

# Google Drive folder ID from the shared link
GOOGLE_DRIVE_FOLDER_ID = "1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"

def connect_redis():
    """Connect to Redis server"""
    try:
        client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        client.ping()
        print("✅ Connected to Redis")
        return client
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return None


def export_cache_to_json(output_file: str = "mindnex_cache_export.json"):
    """Export all cached data to JSON file"""
    client = connect_redis()
    if not client:
        return None
    
    print("\n📦 Exporting cache data...")
    
    # Get all keys
    keys = list(client.keys('*'))
    
    if not keys:
        print("📭 No data to export")
        return None
    
    export_data = {
        "export_date": datetime.now().isoformat(),
        "total_items": len(keys),
        "cached_responses": []
    }
    
    for i, key in enumerate(keys, 1):
        print(f"Processing {i}/{len(keys)}: {key}")
        
        try:
            # Get key type
            key_type = client.type(key)
            
            item = {
                "cache_key": key,
                "key_type": key_type,
                "timestamp": datetime.now().isoformat()
            }
            
            # Get value based on type
            if key_type == 'string':
                item['data'] = client.get(key)
            elif key_type == 'hash':
                hash_data = client.hgetall(key)
                item['data'] = hash_data
                
                # Try to parse LangChain format
                if '0' in hash_data:
                    try:
                        parsed = json.loads(hash_data['0'])
                        if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                            item['response_text'] = parsed['kwargs']['text']
                            item['response_type'] = parsed.get('id', ['unknown'])[2] if 'id' in parsed else 'unknown'
                    except:
                        pass
            elif key_type == 'list':
                item['data'] = client.lrange(key, 0, -1)
            elif key_type == 'set':
                item['data'] = list(client.smembers(key))
            elif key_type == 'zset':
                item['data'] = client.zrange(key, 0, -1, withscores=True)
            
            # Get TTL
            ttl = client.ttl(key)
            item['ttl'] = ttl if ttl > 0 else "no expiration"
            
            export_data["cached_responses"].append(item)
            
        except Exception as e:
            print(f"⚠️  Error processing key {key}: {e}")
            continue
    
    # Write to JSON file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    file_size = os.path.getsize(output_file)
    print(f"\n✅ Exported {len(export_data['cached_responses'])} items to {output_file}")
    print(f"📊 File size: {file_size / 1024:.2f} KB")
    
    return output_file


def export_detailed_responses(output_file: str = "mindnex_responses_detailed.json"):
    """Export with detailed response analysis"""
    client = connect_redis()
    if not client:
        return None
    
    print("\n📝 Creating detailed export...")
    
    keys = list(client.keys('*'))
    
    export_data = {
        "metadata": {
            "export_date": datetime.now().isoformat(),
            "platform": "Mindnex.ai",
            "model": "Mistral-7B-Instruct-v0.3",
            "total_items": len(keys)
        },
        "responses": []
    }
    
    for key in keys:
        try:
            key_type = client.type(key)
            
            if key_type == 'hash':
                hash_data = client.hgetall(key)
                
                if '0' in hash_data:
                    try:
                        parsed = json.loads(hash_data['0'])
                        
                        response_item = {
                            "id": key,
                            "timestamp": datetime.now().isoformat(),
                            "type": "llm_response"
                        }
                        
                        # Extract response text
                        if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                            text = parsed['kwargs']['text']
                            response_item['response'] = text
                            response_item['word_count'] = len(text.split())
                            response_item['char_count'] = len(text)
                        
                        # Add metadata
                        if 'id' in parsed:
                            response_item['response_class'] = parsed['id']
                        
                        export_data['responses'].append(response_item)
                        
                    except Exception as e:
                        pass
        except Exception as e:
            continue
    
    # Write to JSON
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    file_size = os.path.getsize(output_file)
    print(f"✅ Created detailed export: {output_file}")
    print(f"📊 File size: {file_size / 1024:.2f} KB")
    
    return output_file


def install_google_drive_client():
    """Install required packages for Google Drive"""
    print("\n📦 Installing Google Drive packages...")
    print("Run these commands:")
    print("\n  pip install google-auth google-auth-oauthlib google-auth-httplib2")
    print("  pip install google-api-python-client")
    print("\nAfter installation, run this script again with --setup flag")


def setup_google_drive_credentials():
    """Guide user through Google Drive setup"""
    print("\n" + "="*70)
    print("🔐 GOOGLE DRIVE SETUP GUIDE")
    print("="*70)
    
    print("""
STEP 1: Enable Google Drive API
-------------------------------
1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Enable "Google Drive API"
4. Go to "Credentials" tab

STEP 2: Create OAuth 2.0 Credentials
------------------------------------
1. Click "Create Credentials" → "OAuth 2.0 Client ID"
2. Application type: "Desktop app"
3. Name it: "Mindnex.ai Data Export"
4. Click "Create"
5. Download the JSON file
6. Rename it to: credentials.json
7. Place it in this folder: {0}

STEP 3: Run Upload
------------------
After placing credentials.json:
  python google_drive_export.py --upload

First time will open browser for authorization.
After that, it will work automatically!

Target Folder: 
https://drive.google.com/drive/folders/{1}
""".format(os.getcwd(), GOOGLE_DRIVE_FOLDER_ID))


def upload_to_google_drive(file_path: str):
    """Upload file to Google Drive"""
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        import os.path
        
        print(f"\n📤 Uploading {file_path} to Google Drive...")
        
        SCOPES = ['https://www.googleapis.com/auth/drive.file']
        
        creds = None
        
        # Check for existing token
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        
        # If no valid credentials, authenticate
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists('credentials.json'):
                    print("\n❌ credentials.json not found!")
                    print("Run: python google_drive_export.py --setup")
                    return False
                
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials for next time
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)
        
        # Build Drive service
        service = build('drive', 'v3', credentials=creds)
        
        # File metadata
        file_metadata = {
            'name': os.path.basename(file_path),
            'parents': [GOOGLE_DRIVE_FOLDER_ID]
        }
        
        # Upload file
        media = MediaFileUpload(file_path, resumable=True)
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()
        
        print(f"\n✅ Upload successful!")
        print(f"📁 File Name: {file.get('name')}")
        print(f"🔗 File ID: {file.get('id')}")
        print(f"🌐 View Link: {file.get('webViewLink')}")
        
        return True
        
    except ImportError:
        print("\n❌ Google Drive packages not installed!")
        install_google_drive_client()
        return False
    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        return False


def create_summary_json():
    """Create a summary of all activities"""
    summary = {
        "platform": "Mindnex.ai",
        "export_info": {
            "date": datetime.now().isoformat(),
            "purpose": "LLM Response Cache Export",
            "model": "Mistral-7B-Instruct-v0.3 (GGUF 4-bit)",
            "framework": "LangChain + llama-cpp-python"
        },
        "system_info": {
            "cache_backend": "Redis",
            "gpu_acceleration": "Apple Silicon",
            "local_processing": True,
            "privacy": "100% local - no cloud API"
        },
        "files_exported": [],
        "statistics": {}
    }
    
    # Get Redis stats
    client = connect_redis()
    if client:
        keys = list(client.keys('*'))
        summary["statistics"] = {
            "total_cached_items": len(keys),
            "cache_types": {}
        }
        
        for key in keys:
            key_type = client.type(key)
            summary["statistics"]["cache_types"][key_type] = \
                summary["statistics"]["cache_types"].get(key_type, 0) + 1
    
    with open('export_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("✅ Created export_summary.json")
    return 'export_summary.json'


def main():
    """Main export and upload workflow"""
    import sys
    
    print("="*70)
    print("📤 MINDNEX.AI - GOOGLE DRIVE DATA EXPORT")
    print("="*70)
    
    # Check arguments
    if '--setup' in sys.argv:
        setup_google_drive_credentials()
        return
    
    if '--install' in sys.argv:
        install_google_drive_client()
        return
    
    # Check Redis connection
    if not connect_redis():
        print("\n⚠️  Redis not running. Start it with:")
        print("  brew services start redis")
        return
    
    print("\n📋 Export Options:")
    print("  1. Export cache data (full)")
    print("  2. Export responses only (detailed)")
    print("  3. Export both + upload to Google Drive")
    print("  4. Setup Google Drive credentials")
    print("  5. Just upload existing JSON files")
    
    choice = input("\nSelect option (1-5): ").strip()
    
    files_to_upload = []
    
    if choice == '1':
        file = export_cache_to_json()
        if file:
            files_to_upload.append(file)
    
    elif choice == '2':
        file = export_detailed_responses()
        if file:
            files_to_upload.append(file)
    
    elif choice == '3':
        # Export both
        file1 = export_cache_to_json()
        file2 = export_detailed_responses()
        file3 = create_summary_json()
        
        if file1:
            files_to_upload.append(file1)
        if file2:
            files_to_upload.append(file2)
        if file3:
            files_to_upload.append(file3)
        
        # Upload
        if files_to_upload:
            print(f"\n📤 Uploading {len(files_to_upload)} files to Google Drive...")
            for file in files_to_upload:
                upload_to_google_drive(file)
    
    elif choice == '4':
        setup_google_drive_credentials()
    
    elif choice == '5':
        # Find JSON files
        json_files = [f for f in os.listdir('.') if f.endswith('.json')]
        if json_files:
            print(f"\nFound {len(json_files)} JSON files:")
            for i, f in enumerate(json_files, 1):
                print(f"  {i}. {f}")
            
            for file in json_files:
                upload_to_google_drive(file)
        else:
            print("❌ No JSON files found")
    
    else:
        print("❌ Invalid choice")


if __name__ == "__main__":
    main()
