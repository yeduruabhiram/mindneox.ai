# 📤 Google Drive Export Setup Guide

## 🎯 Quick Start

### Step 1: Export Data to JSON
```bash
cd "/Users/yeduruabhiram/Desktop/llm testing "
source venv/bin/activate
python backup_system.py
```

Choose option 4 to export everything!

---

## 📦 What Gets Exported

### File 1: Complete Backup (`mindnex_backup_TIMESTAMP.json`)
Contains:
- ✅ All cached responses
- ✅ Raw cache data  
- ✅ Response text
- ✅ System statistics
- ✅ Timestamps and metadata

### File 2: Responses Only (`responses_only_TIMESTAMP.json`)
Contains:
- ✅ Clean response text
- ✅ Word/character counts
- ✅ Response IDs
- ✅ Metadata

### File 3: Daily Summary (`daily_summary_DATE.json`)
Contains:
- ✅ Statistics summary
- ✅ Total items/responses
- ✅ Average lengths
- ✅ Cache breakdown

---

## 🌐 Upload to Google Drive

### Option A: Manual Upload (Easiest)
1. Export data: `python backup_system.py` (option 4)
2. Go to: https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf
3. Click "New" → "File upload"
4. Select files from `backups/` folder
5. Done! ✅

### Option B: Automatic Upload (Advanced)

**Step 1: Install Google Drive packages**
```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2
pip install google-api-python-client
```

**Step 2: Setup credentials**
```bash
python google_drive_export.py --setup
```

Follow the instructions to:
1. Enable Google Drive API
2. Create OAuth credentials
3. Download credentials.json

**Step 3: Upload files**
```bash
python google_drive_export.py
```

Choose option 3 to export and upload automatically!

---

## 🔄 Workflow Examples

### Daily Backup
```bash
# Run once per day
cd "/Users/yeduruabhiram/Desktop/llm testing "
source venv/bin/activate
python backup_system.py
# Choose option 4 (all exports)
```

Then manually upload to Google Drive.

### After Using the Tutor
```bash
# After each tutoring session
python backup_system.py
# Choose option 2 (responses only)
```

### Weekly Summary
```bash
# Once per week
python backup_system.py
# Choose option 3 (daily summary)
```

---

## 📊 JSON Format Examples

### Complete Backup Structure
```json
{
  "backup_metadata": {
    "timestamp": "2025-11-07T10:30:00",
    "platform": "Mindnex.ai",
    "model": "Mistral-7B-Instruct-v0.3"
  },
  "cache_data": [
    {
      "cache_key": "abc123...",
      "type": "hash",
      "response_text": "Photosynthesis is...",
      "response_length": 450
    }
  ],
  "responses": [
    {
      "id": "abc123",
      "timestamp": "2025-11-07T10:30:00",
      "text": "Full response text here...",
      "word_count": 150,
      "char_count": 890
    }
  ],
  "statistics": {
    "total_keys": 10,
    "total_responses": 10,
    "total_words": 1500,
    "avg_words_per_response": 150
  }
}
```

### Responses Only Structure
```json
{
  "metadata": {
    "export_date": "2025-11-07T10:30:00",
    "platform": "Mindnex.ai",
    "model": "Mistral-7B-Instruct-v0.3"
  },
  "responses": [
    {
      "id": "abc123",
      "timestamp": "2025-11-07T10:30:00",
      "text": "The complete response text...",
      "word_count": 150,
      "char_count": 890,
      "type": "Generation"
    }
  ],
  "statistics": {
    "total_responses": 10,
    "total_words": 1500,
    "total_characters": 8900
  }
}
```

---

## 🔧 Commands Reference

### Export Data
```bash
# All exports
python backup_system.py
# Choose option 4

# Responses only  
python backup_system.py
# Choose option 2

# List existing backups
python backup_system.py
# Choose option 5
```

### Upload to Google Drive
```bash
# Setup (first time only)
python google_drive_export.py --setup

# Upload
python google_drive_export.py
# Choose option 3 (export + upload)
# OR option 5 (upload existing)
```

### View Exported Files
```bash
ls -lh backups/
cat backups/mindnex_backup_*.json | head -50
```

---

## 📁 File Locations

**Local Backups:**
```
/Users/yeduruabhiram/Desktop/llm testing /backups/
├── mindnex_backup_20251107_103000.json
├── responses_only_20251107_103000.json
└── daily_summary_20251107.json
```

**Google Drive:**
```
Your Google Drive/
└── Shared Folder (1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf)/
    ├── mindnex_backup_20251107_103000.json
    ├── responses_only_20251107_103000.json
    └── daily_summary_20251107.json
```

**Google Drive Link:**
https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf

---

## 💡 Tips

1. **Daily Routine:**
   - Morning: Start Redis
   - Use tutor throughout day
   - Evening: Export data (option 4)
   - Upload to Google Drive

2. **Storage Management:**
   - Keep last 7 days locally
   - Upload all to Google Drive
   - Delete old local backups

3. **Best Practices:**
   - Export after important sessions
   - Use option 4 for complete backups
   - Use option 2 for quick saves
   - Use option 3 for weekly summaries

4. **Automation Ideas:**
   - Set up cron job for daily exports
   - Create script to auto-upload
   - Schedule weekly summaries

---

## 🆘 Troubleshooting

**Problem: No data exported**
- Solution: Ensure Redis is running: `brew services start redis`

**Problem: Empty JSON files**
- Solution: Check cache has data: `python quick_view.py`

**Problem: Upload fails**
- Solution: Check credentials.json exists
- Run setup again: `python google_drive_export.py --setup`

**Problem: Large file sizes**
- Solution: Normal! Each response ~1-2KB
- 100 responses ≈ 100-200KB

---

## 📊 Expected File Sizes

| Export Type | Typical Size | For 100 Responses |
|-------------|--------------|-------------------|
| Complete    | Medium       | ~150-250 KB       |
| Responses   | Small        | ~100-150 KB       |
| Summary     | Tiny         | ~5-10 KB          |

---

## ✅ Checklist

Before uploading to Google Drive:

- [ ] Redis is running
- [ ] Exported data using backup_system.py
- [ ] Checked files in backups/ folder
- [ ] Verified JSON files are valid
- [ ] Ready to upload (manual or automatic)

---

## 🎯 Quick Commands

**Export Everything:**
```bash
cd "/Users/yeduruabhiram/Desktop/llm testing "
source venv/bin/activate
python backup_system.py
# Choose 4
```

**Upload to Drive:**
```bash
# Manual: Use browser
# Auto: python google_drive_export.py
```

**Check What's Backed Up:**
```bash
ls -lh backups/
```

---

**Target Google Drive Folder:**
https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf

✅ You're all set! Export your data and upload to Google Drive!
