#!/usr/bin/env python3
"""
Quick CSV Export - One command to export all data to CSV
Perfect for Google Drive / Google Sheets
"""

import csv
import json
import redis
from datetime import datetime
import os

BACKUP_DIR = "backups"
GOOGLE_DRIVE_FOLDER = "https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"


def main():
    """Export all data to CSV files"""
    
    print("\n" + "="*70)
    print("📊 EXPORTING DATA TO CSV FOR GOOGLE DRIVE")
    print("="*70)
    
    # Create backup directory
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
    
    # Connect to Redis
    try:
        client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        client.ping()
        print("✅ Connected to Redis")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return
    
    # Get timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Collect all responses
    print("\n📦 Collecting responses from cache...")
    
    responses_data = []
    keys = list(client.keys('*'))
    
    print(f"Found {len(keys)} cached items")
    
    for i, key in enumerate(keys, 1):
        try:
            key_type = client.type(key)
            
            if key_type == 'hash':
                hash_data = client.hgetall(key)
                
                if '0' in hash_data:
                    try:
                        parsed = json.loads(hash_data['0'])
                        
                        if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                            text = parsed['kwargs']['text']
                            words = text.split()
                            
                            response_data = {
                                'ID': i,
                                'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                                'Preview': text[:100].replace('\n', ' ').strip(),
                                'Word_Count': len(words),
                                'Character_Count': len(text),
                                'Lines': text.count('\n') + 1,
                                'Response_Text': text,
                                'Cache_Key': key
                            }
                            
                            responses_data.append(response_data)
                            print(f"  ✓ Response {i}")
                            
                    except:
                        pass
        except:
            continue
    
    if not responses_data:
        print("\n❌ No data to export")
        return
    
    # Calculate statistics
    total_words = sum(r['Word_Count'] for r in responses_data)
    total_chars = sum(r['Character_Count'] for r in responses_data)
    avg_words = total_words / len(responses_data)
    
    print(f"\n📊 Found {len(responses_data)} responses")
    print(f"   Total words: {total_words:,}")
    print(f"   Average words per response: {avg_words:.1f}")
    
    # === CSV FILE 1: Main Responses ===
    filename1 = f"{BACKUP_DIR}/responses_{timestamp}.csv"
    
    print(f"\n💾 Creating: {filename1}")
    
    with open(filename1, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['ID', 'Timestamp', 'Preview', 'Word_Count', 'Character_Count', 'Lines', 'Response_Text', 'Cache_Key']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(responses_data)
    
    size1 = os.path.getsize(filename1) / 1024
    print(f"   ✅ {size1:.2f} KB - Main responses data")
    
    # === CSV FILE 2: Statistics Summary ===
    filename2 = f"{BACKUP_DIR}/statistics_{timestamp}.csv"
    
    print(f"\n💾 Creating: {filename2}")
    
    stats_data = [
        {'Metric': 'Total Responses', 'Value': len(responses_data)},
        {'Metric': 'Total Words', 'Value': total_words},
        {'Metric': 'Total Characters', 'Value': total_chars},
        {'Metric': 'Average Words per Response', 'Value': round(avg_words, 2)},
        {'Metric': 'Average Characters per Response', 'Value': round(total_chars / len(responses_data), 2)},
        {'Metric': 'Longest Response (words)', 'Value': max(r['Word_Count'] for r in responses_data)},
        {'Metric': 'Shortest Response (words)', 'Value': min(r['Word_Count'] for r in responses_data)},
        {'Metric': 'Export Date', 'Value': datetime.now().strftime("%Y-%m-%d")},
        {'Metric': 'Export Time', 'Value': datetime.now().strftime("%H:%M:%S")},
    ]
    
    with open(filename2, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Metric', 'Value']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(stats_data)
    
    size2 = os.path.getsize(filename2) / 1024
    print(f"   ✅ {size2:.2f} KB - Statistics summary")
    
    # === CSV FILE 3: Detailed Analysis ===
    filename3 = f"{BACKUP_DIR}/analysis_{timestamp}.csv"
    
    print(f"\n💾 Creating: {filename3}")
    
    analysis_data = []
    for i, resp in enumerate(responses_data, 1):
        text = resp['Response_Text']
        words = text.split()
        
        analysis = {
            'Response_ID': i,
            'Date': datetime.now().strftime("%Y-%m-%d"),
            'Time': datetime.now().strftime("%H:%M:%S"),
            'Word_Count': len(words),
            'Character_Count': len(text),
            'Character_Count_No_Spaces': len(text.replace(' ', '')),
            'Line_Count': text.count('\n') + 1,
            'Sentence_Count': text.count('.') + text.count('!') + text.count('?'),
            'Average_Word_Length': round(sum(len(w) for w in words) / len(words), 2) if words else 0,
            'Has_Code': 'Yes' if any(x in text for x in ['def ', 'class ', 'import ', 'function']) else 'No',
            'Has_Math': 'Yes' if any(x in text for x in ['=', '+', '-', '*', '/']) else 'No',
            'Has_List': 'Yes' if any(x in text for x in ['1.', '2.', '•', '-']) else 'No',
        }
        analysis_data.append(analysis)
    
    with open(filename3, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = list(analysis_data[0].keys())
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(analysis_data)
    
    size3 = os.path.getsize(filename3) / 1024
    print(f"   ✅ {size3:.2f} KB - Detailed analysis")
    
    # Summary
    total_size = size1 + size2 + size3
    
    print("\n" + "="*70)
    print("🎉 CSV EXPORT COMPLETE!")
    print("="*70)
    
    print(f"\n📁 Created 3 CSV files ({total_size:.2f} KB total):")
    print(f"   1. {filename1} - Main data")
    print(f"   2. {filename2} - Statistics")
    print(f"   3. {filename3} - Analysis")
    
    print(f"\n📤 UPLOAD TO GOOGLE DRIVE:")
    print(f"   1. Open: {GOOGLE_DRIVE_FOLDER}")
    print("   2. Click 'New' → 'File upload'")
    print(f"   3. Upload all 3 files from '{BACKUP_DIR}/' folder")
    print("   4. Files will automatically convert to Google Sheets!")
    
    print("\n💡 TIP: In Google Sheets you can:")
    print("   • Create charts and graphs")
    print("   • Filter and sort data")
    print("   • Use formulas for analysis")
    print("   • Share with others")
    print("   • Export to Excel or PDF")
    
    print("\n✅ All done! Your data is ready for Google Drive.")


if __name__ == "__main__":
    main()
