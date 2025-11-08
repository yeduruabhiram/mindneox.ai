#!/usr/bin/env python3
"""
Automatic CSV Upload to Google Drive
Exports data to CSV and uploads to your Google Drive folder
"""

import os
import csv_export
from datetime import datetime

# Google Drive folder for CSV files
GOOGLE_DRIVE_FOLDER_LINK = "https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"
GOOGLE_DRIVE_FOLDER_ID = "1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf"

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    import pickle
    GOOGLE_API_AVAILABLE = True
except ImportError:
    GOOGLE_API_AVAILABLE = False


def setup_google_drive():
    """Setup Google Drive API authentication"""
    
    if not GOOGLE_API_AVAILABLE:
        print("\n⚠️  Google Drive API not installed")
        print("\nTo enable automatic uploads, install:")
        print("  pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client")
        return None
    
    SCOPES = ['https://www.googleapis.com/auth/drive.file']
    creds = None
    
    # Load saved credentials
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    
    # Refresh or get new credentials
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists('credentials.json'):
                print("\n❌ Missing credentials.json")
                print("\nSetup steps:")
                print("  1. Go to: https://console.cloud.google.com/")
                print("  2. Create OAuth 2.0 credentials")
                print("  3. Download as 'credentials.json'")
                print("  4. Place in this directory")
                return None
            
            flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        
        # Save credentials
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)
    
    return build('drive', 'v3', credentials=creds)


def upload_csv_to_drive(service, filepath):
    """Upload a CSV file to Google Drive"""
    
    if not service:
        return None
    
    try:
        filename = os.path.basename(filepath)
        
        file_metadata = {
            'name': filename,
            'parents': [GOOGLE_DRIVE_FOLDER_ID],
            'mimeType': 'application/vnd.google-apps.spreadsheet'  # Convert to Google Sheets
        }
        
        media = MediaFileUpload(filepath, mimetype='text/csv', resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()
        
        print(f"\n✅ Uploaded: {filename}")
        print(f"   Link: {file.get('webViewLink')}")
        
        return file
    
    except Exception as e:
        print(f"\n❌ Upload failed: {e}")
        return None


def export_and_upload():
    """Export CSV files and upload to Google Drive"""
    
    print("\n" + "="*70)
    print("📤 CSV EXPORT & GOOGLE DRIVE UPLOAD")
    print("="*70)
    
    # Step 1: Export to CSV
    print("\n📊 Step 1: Exporting data to CSV files...")
    csv_files = csv_export.export_all_csv()
    
    if not csv_files:
        print("\n❌ No files to upload")
        return
    
    # Step 2: Setup Google Drive (if available)
    print("\n☁️  Step 2: Setting up Google Drive...")
    
    if not GOOGLE_API_AVAILABLE:
        print("\n📤 MANUAL UPLOAD REQUIRED:")
        print(f"\n  1. Open: {GOOGLE_DRIVE_FOLDER_LINK}")
        print("  2. Click 'New' → 'File upload'")
        print("  3. Select these files:")
        for f in csv_files:
            print(f"     - {f}")
        print("\n  4. CSV files will be converted to Google Sheets automatically!")
        return
    
    service = setup_google_drive()
    
    if not service:
        print("\n📤 MANUAL UPLOAD REQUIRED:")
        print(f"\n  Open: {GOOGLE_DRIVE_FOLDER_LINK}")
        print("  Upload files from backups/ folder")
        return
    
    # Step 3: Upload files
    print("\n☁️  Step 3: Uploading to Google Drive...")
    
    uploaded = []
    for filepath in csv_files:
        result = upload_csv_to_drive(service, filepath)
        if result:
            uploaded.append(result)
    
    # Summary
    if uploaded:
        print("\n" + "="*70)
        print("🎉 UPLOAD COMPLETE!")
        print("="*70)
        print(f"\n✅ Uploaded {len(uploaded)} files to Google Drive")
        print(f"\n📂 View all files:")
        print(f"   {GOOGLE_DRIVE_FOLDER_LINK}")
        print("\n📊 Files are automatically converted to Google Sheets!")
        print("   You can now:")
        print("   • Create charts and visualizations")
        print("   • Analyze with formulas")
        print("   • Share with others")
        print("   • Export to other formats")


def quick_upload():
    """Quick upload - exports and uploads in one command"""
    
    print("\n🚀 Quick Upload to Google Drive")
    print("   This will export all data to CSV and upload automatically")
    
    confirm = input("\n   Continue? (y/n): ").strip().lower()
    
    if confirm == 'y':
        export_and_upload()
    else:
        print("\n❌ Cancelled")


def main():
    """Main menu"""
    
    print("\n" + "="*70)
    print("☁️  GOOGLE DRIVE CSV UPLOADER")
    print("="*70)
    
    print("\n📋 Options:")
    print("  1. Export & Upload (automatic)")
    print("  2. Export only (manual upload)")
    print("  3. Open Google Drive folder")
    print("  4. Exit")
    
    choice = input("\nSelect option (1-4): ").strip()
    
    if choice == '1':
        export_and_upload()
    
    elif choice == '2':
        print("\n📊 Exporting to CSV...")
        csv_files = csv_export.export_all_csv()
        if csv_files:
            print("\n📤 Manual upload instructions:")
            print(f"   1. Open: {GOOGLE_DRIVE_FOLDER_LINK}")
            print("   2. Upload files from backups/ folder")
            print("   3. Files will convert to Google Sheets!")
    
    elif choice == '3':
        print(f"\n📂 Google Drive folder:")
        print(f"   {GOOGLE_DRIVE_FOLDER_LINK}")
        print("\n   Opening in browser...")
        os.system(f"open '{GOOGLE_DRIVE_FOLDER_LINK}'")
    
    elif choice == '4':
        print("\n👋 Goodbye!")
    
    else:
        print("\n❌ Invalid choice")


if __name__ == "__main__":
    main()
