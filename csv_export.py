#!/usr/bin/env python3
"""
CSV Export for Mindnex.ai - Export all data to CSV format
Perfect for Excel, Google Sheets, and data analysis
"""

import csv
import json
import redis
from datetime import datetime
import os

GOOGLE_DRIVE_FOLDER_ID = "1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"
BACKUP_DIR = "backups"


def ensure_backup_dir():
    """Create backup directory if not exists"""
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"✅ Created backup directory: {BACKUP_DIR}")


def connect_redis():
    """Connect to Redis server"""
    try:
        client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        client.ping()
        print("✅ Connected to Redis")
        return client
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        print("Start Redis with: brew services start redis")
        return None


def export_responses_to_csv():
    """Export all responses to CSV file"""
    
    print("\n" + "="*70)
    print("📊 EXPORTING RESPONSES TO CSV")
    print("="*70)
    
    client = connect_redis()
    if not client:
        return None
    
    ensure_backup_dir()
    
    # Collect all responses
    print("\n📦 Collecting responses...")
    
    responses_data = []
    keys = list(client.keys('*'))
    
    print(f"Found {len(keys)} cached items\n")
    
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
                            
                            # Extract topic/subject from response (first 100 chars)
                            preview = text[:100].replace('\n', ' ').strip()
                            
                            response_data = {
                                'ID': i,
                                'Cache_Key': key,
                                'Timestamp': datetime.now().isoformat(),
                                'Response_Text': text,
                                'Preview': preview + '...' if len(text) > 100 else preview,
                                'Word_Count': len(text.split()),
                                'Character_Count': len(text),
                                'Lines': text.count('\n') + 1,
                                'Response_Type': parsed.get('id', ['unknown'])[2] if 'id' in parsed else 'unknown'
                            }
                            
                            responses_data.append(response_data)
                            print(f"✓ Processed response {i}: {preview[:50]}...")
                            
                    except Exception as e:
                        print(f"⚠️  Error parsing response {i}: {e}")
                        continue
        except Exception as e:
            print(f"⚠️  Error processing key {key}: {e}")
            continue
    
    if not responses_data:
        print("\n❌ No responses to export")
        return None
    
    # Write to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{BACKUP_DIR}/mindnex_responses_{timestamp}.csv"
    
    print(f"\n💾 Writing to CSV: {filename}")
    
    # CSV headers
    fieldnames = [
        'ID',
        'Timestamp',
        'Preview',
        'Word_Count',
        'Character_Count',
        'Lines',
        'Response_Type',
        'Response_Text',
        'Cache_Key'
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in responses_data:
            writer.writerow(row)
    
    file_size = os.path.getsize(filename)
    
    print("\n" + "="*70)
    print("✅ CSV EXPORT COMPLETE!")
    print("="*70)
    print(f"\n📁 File: {filename}")
    print(f"📊 Size: {file_size / 1024:.2f} KB")
    print(f"📝 Responses: {len(responses_data)}")
    print(f"📈 Total Words: {sum(r['Word_Count'] for r in responses_data):,}")
    print(f"📏 Total Characters: {sum(r['Character_Count'] for r in responses_data):,}")
    
    return filename


def export_statistics_to_csv():
    """Export statistics summary to CSV"""
    
    print("\n" + "="*70)
    print("📊 EXPORTING STATISTICS TO CSV")
    print("="*70)
    
    client = connect_redis()
    if not client:
        return None
    
    ensure_backup_dir()
    
    # Collect statistics
    print("\n📈 Calculating statistics...")
    
    keys = list(client.keys('*'))
    
    stats_data = []
    total_words = 0
    total_chars = 0
    total_responses = 0
    
    for key in keys:
        try:
            key_type = client.type(key)
            
            if key_type == 'hash':
                hash_data = client.hgetall(key)
                
                if '0' in hash_data:
                    try:
                        parsed = json.loads(hash_data['0'])
                        
                        if 'kwargs' in parsed and 'text' in parsed['kwargs']:
                            text = parsed['kwargs']['text']
                            words = len(text.split())
                            chars = len(text)
                            
                            total_responses += 1
                            total_words += words
                            total_chars += chars
                            
                    except:
                        pass
        except:
            continue
    
    # Calculate averages
    avg_words = total_words / total_responses if total_responses > 0 else 0
    avg_chars = total_chars / total_responses if total_responses > 0 else 0
    
    # Create statistics rows
    stats_data = [
        {'Metric': 'Total Responses', 'Value': total_responses},
        {'Metric': 'Total Words', 'Value': total_words},
        {'Metric': 'Total Characters', 'Value': total_chars},
        {'Metric': 'Average Words per Response', 'Value': round(avg_words, 2)},
        {'Metric': 'Average Characters per Response', 'Value': round(avg_chars, 2)},
        {'Metric': 'Total Cache Keys', 'Value': len(keys)},
        {'Metric': 'Export Date', 'Value': datetime.now().strftime("%Y-%m-%d")},
        {'Metric': 'Export Time', 'Value': datetime.now().strftime("%H:%M:%S")},
    ]
    
    # Write to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{BACKUP_DIR}/mindnex_statistics_{timestamp}.csv"
    
    print(f"\n💾 Writing statistics to CSV: {filename}")
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['Metric', 'Value']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in stats_data:
            writer.writerow(row)
    
    file_size = os.path.getsize(filename)
    
    print("\n" + "="*70)
    print("✅ STATISTICS CSV COMPLETE!")
    print("="*70)
    print(f"\n📁 File: {filename}")
    print(f"📊 Size: {file_size / 1024:.2f} KB")
    print(f"📈 Metrics: {len(stats_data)}")
    
    return filename


def export_detailed_analysis_to_csv():
    """Export detailed response analysis to CSV"""
    
    print("\n" + "="*70)
    print("📊 EXPORTING DETAILED ANALYSIS TO CSV")
    print("="*70)
    
    client = connect_redis()
    if not client:
        return None
    
    ensure_backup_dir()
    
    print("\n🔬 Analyzing responses...")
    
    analysis_data = []
    keys = list(client.keys('*'))
    
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
                            
                            # Detailed analysis
                            analysis = {
                                'Response_ID': i,
                                'Date': datetime.now().strftime("%Y-%m-%d"),
                                'Time': datetime.now().strftime("%H:%M:%S"),
                                'Word_Count': len(words),
                                'Character_Count': len(text),
                                'Character_Count_No_Spaces': len(text.replace(' ', '')),
                                'Line_Count': text.count('\n') + 1,
                                'Paragraph_Count': text.count('\n\n') + 1,
                                'Sentence_Count': text.count('.') + text.count('!') + text.count('?'),
                                'Average_Word_Length': round(sum(len(w) for w in words) / len(words), 2) if words else 0,
                                'Longest_Word_Length': max(len(w) for w in words) if words else 0,
                                'Has_Code': 'Yes' if any(x in text for x in ['def ', 'class ', 'import ', 'function']) else 'No',
                                'Has_Math': 'Yes' if any(x in text for x in ['=', '+', '-', '*', '/', '²', '³']) else 'No',
                                'Contains_URL': 'Yes' if 'http' in text or 'www.' in text else 'No',
                                'Contains_List': 'Yes' if any(x in text for x in ['1.', '2.', '•', '-', '*']) else 'No',
                                'Language_Indicators': 'Mixed' if any(ord(c) > 127 for c in text) else 'English'
                            }
                            
                            analysis_data.append(analysis)
                            print(f"✓ Analyzed response {i}")
                            
                    except Exception as e:
                        print(f"⚠️  Error analyzing response {i}: {e}")
                        continue
        except Exception as e:
            continue
    
    if not analysis_data:
        print("\n❌ No data to analyze")
        return None
    
    # Write to CSV
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{BACKUP_DIR}/mindnex_analysis_{timestamp}.csv"
    
    print(f"\n💾 Writing analysis to CSV: {filename}")
    
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        if analysis_data:
            fieldnames = list(analysis_data[0].keys())
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(analysis_data)
    
    file_size = os.path.getsize(filename)
    
    print("\n" + "="*70)
    print("✅ ANALYSIS CSV COMPLETE!")
    print("="*70)
    print(f"\n📁 File: {filename}")
    print(f"📊 Size: {file_size / 1024:.2f} KB")
    print(f"🔬 Analyzed: {len(analysis_data)} responses")
    
    return filename


def export_all_csv():
    """Export all CSV formats"""
    
    print("\n" + "="*70)
    print("📦 EXPORTING ALL DATA TO CSV FORMAT")
    print("="*70)
    
    files = []
    
    # Export responses
    file1 = export_responses_to_csv()
    if file1:
        files.append(file1)
    
    # Export statistics
    file2 = export_statistics_to_csv()
    if file2:
        files.append(file2)
    
    # Export analysis
    file3 = export_detailed_analysis_to_csv()
    if file3:
        files.append(file3)
    
    # Summary
    if files:
        print("\n" + "="*70)
        print("🎉 ALL CSV EXPORTS COMPLETE!")
        print("="*70)
        print(f"\nCreated {len(files)} CSV files:")
        for i, file in enumerate(files, 1):
            size = os.path.getsize(file)
            print(f"  {i}. {file} ({size / 1024:.2f} KB)")
        
        print("\n📤 UPLOAD TO GOOGLE DRIVE:")
        print("  1. Open: https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf")
        print(f"  2. Upload files from: {BACKUP_DIR}/")
        print("  3. Open in Google Sheets for analysis!")
        
    return files


def main():
    """Main menu"""
    
    print("\n" + "="*70)
    print("📊 MINDNEX.AI - CSV EXPORT SYSTEM")
    print("="*70)
    
    print("\n📋 Export Options:")
    print("  1. Export responses to CSV (main data)")
    print("  2. Export statistics to CSV (summary)")
    print("  3. Export detailed analysis to CSV (metrics)")
    print("  4. Export all CSV files (recommended)")
    print("  5. List existing CSV files")
    print("  6. Exit")
    
    choice = input("\nSelect option (1-6): ").strip()
    
    if choice == '1':
        filename = export_responses_to_csv()
        if filename:
            print(f"\n✅ Exported! Ready to upload to Google Drive")
            print(f"   File: {filename}")
    
    elif choice == '2':
        filename = export_statistics_to_csv()
        if filename:
            print(f"\n✅ Exported! Ready to upload to Google Drive")
            print(f"   File: {filename}")
    
    elif choice == '3':
        filename = export_detailed_analysis_to_csv()
        if filename:
            print(f"\n✅ Exported! Ready to upload to Google Drive")
            print(f"   File: {filename}")
    
    elif choice == '4':
        files = export_all_csv()
        if files:
            print(f"\n🎉 All {len(files)} CSV files ready!")
            print("\n📤 Next step:")
            print("   1. Go to: https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf")
            print("   2. Click 'New' → 'File upload'")
            print(f"   3. Select files from '{BACKUP_DIR}/' folder")
            print("   4. Open in Google Sheets!")
    
    elif choice == '5':
        # List CSV files
        if os.path.exists(BACKUP_DIR):
            csv_files = [f for f in os.listdir(BACKUP_DIR) if f.endswith('.csv')]
            if csv_files:
                print(f"\n📁 Found {len(csv_files)} CSV files:")
                for i, f in enumerate(sorted(csv_files, reverse=True), 1):
                    size = os.path.getsize(os.path.join(BACKUP_DIR, f))
                    print(f"  {i}. {f} ({size / 1024:.2f} KB)")
            else:
                print("\n📭 No CSV files found")
        else:
            print("\n📭 Backup directory doesn't exist yet")
    
    elif choice == '6':
        print("\n👋 Goodbye!")
        return
    
    else:
        print("\n❌ Invalid choice")


if __name__ == "__main__":
    main()
