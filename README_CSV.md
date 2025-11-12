# 📊 CSV Export for Google Drive - Complete Guide

Export all your Mindnex.ai data to CSV format for Google Drive and Google Sheets!

---

## 🚀 Quick Start

### Export All Data to CSV

```bash
python quick_csv_export.py
```

This creates **3 CSV files**:
1. **responses_[timestamp].csv** - All your AI responses
2. **statistics_[timestamp].csv** - Summary statistics
3. **analysis_[timestamp].csv** - Detailed metrics

### Files are saved to: `backups/` folder

---

## 📤 Upload to Google Drive

### Method 1: Manual Upload (Easiest)

1. **Run export:**
   ```bash
   python quick_csv_export.py
   ```

2. **Open Google Drive folder:**
   [https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf](https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf)

3. **Upload files:**
   - Click "New" → "File upload"
   - Select all 3 CSV files from `backups/` folder
   - Files will automatically convert to Google Sheets! ✨

### Method 2: Automatic Upload (Advanced)

```bash
python google_drive_csv_upload.py
```

**Requirements:**
- Google Drive API credentials
- OAuth 2.0 setup

**Setup instructions:**
See `GOOGLE_DRIVE_SETUP.md` for detailed steps

---

## 📋 CSV Files Explained

### 1. responses_[timestamp].csv
**Main data file** - Contains all AI responses

| Column | Description |
|--------|-------------|
| ID | Response number (1, 2, 3...) |
| Timestamp | When exported |
| Preview | First 100 characters |
| Word_Count | Number of words |
| Character_Count | Total characters |
| Lines | Number of lines |
| Response_Text | **Full response text** |
| Cache_Key | Redis cache key |

**Perfect for:**
- Reading full responses
- Searching and filtering data
- Copying responses for other uses

### 2. statistics_[timestamp].csv
**Summary statistics**

Includes:
- Total responses
- Total words
- Total characters
- Average words per response
- Average characters per response
- Longest response (words)
- Shortest response (words)
- Export date and time

**Perfect for:**
- Quick overview of your data
- Tracking growth over time
- Creating summary reports

### 3. analysis_[timestamp].csv
**Detailed analysis** - One row per response

| Column | Description |
|--------|-------------|
| Response_ID | Response number |
| Date | Export date |
| Time | Export time |
| Word_Count | Words in response |
| Character_Count | Characters with spaces |
| Character_Count_No_Spaces | Characters without spaces |
| Line_Count | Number of lines |
| Sentence_Count | Approximate sentences |
| Average_Word_Length | Avg length of words |
| Has_Code | Contains code? (Yes/No) |
| Has_Math | Contains math? (Yes/No) |
| Has_List | Contains lists? (Yes/No) |

**Perfect for:**
- Creating charts in Google Sheets
- Finding patterns in responses
- Analyzing content types

---

## 📊 Using in Google Sheets

### After Uploading to Google Drive:

1. **Open any CSV file** - It automatically converts to Google Sheets

2. **Create Charts:**
   - Select data
   - Insert → Chart
   - Try: Bar chart of word counts, Pie chart of content types

3. **Filter Data:**
   - Click column header → "Create a filter"
   - Filter by word count, date, content type

4. **Sort Data:**
   - Click column header → "Sort A to Z" or "Sort Z to A"

5. **Use Formulas:**
   ```
   =SUM(D2:D100)      // Total words
   =AVERAGE(D2:D100)  // Average words
   =MAX(D2:D100)      // Longest response
   =COUNTIF(J2:J100, "Yes")  // Count responses with code
   ```

### Example Visualizations

**Word Count Distribution:**
- Chart type: Histogram
- Data: Word_Count column
- Shows: How long your responses typically are

**Content Type Breakdown:**
- Chart type: Pie chart
- Data: Has_Code, Has_Math, Has_List columns
- Shows: What types of content you generate most

**Responses Over Time:**
- Chart type: Line chart
- Data: Date vs Response_ID
- Shows: Your usage patterns

---

## 🗂️ File Organization

### Recommended Google Drive Structure

```
📁 Mindnex.ai Data
  📁 Daily Exports
    📄 responses_20251107_144205.csv
    📄 statistics_20251107_144205.csv
    📄 analysis_20251107_144205.csv
  
  📁 Weekly Summaries
    📄 week_2024_11_summary.csv
  
  📁 Charts & Analysis
    📊 word_count_trends.sheets
    📊 content_analysis.sheets
```

### Export Naming Convention

Files are automatically named with timestamps:
- `responses_YYYYMMDD_HHMMSS.csv`
- `statistics_YYYYMMDD_HHMMSS.csv`
- `analysis_YYYYMMDD_HHMMSS.csv`

**Example:** `responses_20251107_144205.csv`
- Date: November 7, 2025
- Time: 14:42:05 (2:42 PM)

---

## ⏰ Daily Workflow

### Recommended Daily Routine:

1. **Morning:**
   ```bash
   python quick_csv_export.py
   ```

2. **Upload to Google Drive**
   - Use manual upload method
   - Takes ~2 minutes

3. **Weekly Review:**
   - Compare statistics across weeks
   - Create summary charts
   - Archive old files

4. **Monthly Backup:**
   - Download all CSV files from Google Drive
   - Store locally as backup
   - Create monthly summary report

---

## 🔧 Advanced Usage

### Export Options

#### Quick Export (Recommended)
```bash
python quick_csv_export.py
```
Creates all 3 CSV files instantly

#### Interactive Export
```bash
python csv_export.py
```
Menu with options:
1. Export responses only
2. Export statistics only
3. Export analysis only
4. Export all files
5. List existing files

#### Automatic Upload
```bash
python google_drive_csv_upload.py
```
Exports and uploads automatically (requires OAuth setup)

### Export Specific Data

To export only recent data, modify `quick_csv_export.py`:

```python
# Add this after line 44 (after getting keys)
from datetime import datetime, timedelta

# Only process keys from last 7 days
week_ago = datetime.now() - timedelta(days=7)
recent_keys = []
for key in keys:
    # Filter by your criteria
    recent_keys.append(key)
```

---

## 📈 Sample Data

### Example Row from responses.csv

```csv
ID,Timestamp,Preview,Word_Count,Character_Count,Lines,Response_Text,Cache_Key
1,"2025-11-07 14:42:05","Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide...",195,1234,15,"Full response text here...",llmcache:f4e2a...
```

### Example from statistics.csv

```csv
Metric,Value
Total Responses,11
Total Words,2151
Total Characters,13882
Average Words per Response,195.5
Average Characters per Response,1262.0
Longest Response (words),312
Shortest Response (words),87
Export Date,2025-11-07
Export Time,14:42:05
```

### Example from analysis.csv

```csv
Response_ID,Date,Time,Word_Count,Character_Count,Has_Code,Has_Math,Has_List
1,2025-11-07,14:42:05,195,1234,No,Yes,Yes
2,2025-11-07,14:42:05,287,1823,Yes,No,Yes
```

---

## 🎯 Best Practices

### 1. Regular Exports
- Export daily or weekly
- Don't wait until you have too much data
- Easier to manage smaller files

### 2. File Organization
- Create dated folders in Google Drive
- Archive old exports monthly
- Keep most recent exports easily accessible

### 3. Data Analysis
- Review statistics weekly
- Look for trends in word counts
- Identify most common content types

### 4. Backup Strategy
- Keep CSV files in Google Drive (primary)
- Download local copies monthly (backup)
- Export before major system changes

### 5. Google Sheets Tips
- Freeze top row (View → Freeze → 1 row)
- Apply filters to columns
- Create named ranges for formulas
- Use conditional formatting for highlighting

---

## 🐛 Troubleshooting

### "Redis connection failed"

**Problem:** Can't connect to Redis
**Solution:**
```bash
brew services start redis
```

### "No data to export"

**Problem:** Redis cache is empty
**Solution:** Use the system first to generate some responses:
```bash
python main.py
python mindnex_integration.py
```

### "Permission denied"

**Problem:** Can't write to backups/ folder
**Solution:**
```bash
mkdir backups
chmod 755 backups
```

### CSV file won't open in Excel

**Problem:** Encoding issues
**Solution:** 
- Use Google Sheets instead (handles UTF-8 automatically)
- Or in Excel: Data → From Text → Select UTF-8 encoding

### File too large for Google Sheets

**Problem:** CSV > 5 MB
**Solution:**
- Google Sheets supports files up to 5 MB
- Split large files or filter data
- Use Google Drive for storage, query smaller chunks

---

## 📊 Example Analysis in Google Sheets

### 1. Total Words Formula
```
=SUM(D2:D1000)
```
Place in any cell to get total words across all responses

### 2. Average Response Length
```
=AVERAGE(D2:D1000)
```
Shows average words per response

### 3. Count Long Responses (>200 words)
```
=COUNTIF(D2:D1000, ">200")
```

### 4. Percentage with Code
```
=COUNTIF(J2:J1000, "Yes") / COUNTA(J2:J1000) * 100
```

### 5. Find Longest Response
```
=INDEX(Response_Text, MATCH(MAX(Word_Count), Word_Count, 0))
```

---

## 🔗 Quick Links

### Your Google Drive Folder
[https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf](https://drive.google.com/drive/folders/1BtBO46sQ_B3JGDAqcyMkEaos79L9MHjf)

### Related Documentation
- `USER_MANUAL.md` - Complete system documentation
- `GOOGLE_DRIVE_SETUP.md` - OAuth setup for automatic uploads
- `README_EXPORT.md` - JSON export documentation
- `QUICK_REFERENCE.txt` - Command cheat sheet

---

## 💡 Pro Tips

1. **Use Google Sheets Templates**
   - Create a template with your favorite charts
   - Copy template for each new export
   - Saves time on formatting

2. **Combine Multiple Exports**
   - Import multiple CSV files into one sheet
   - Use Query function to combine data
   - Analyze trends over time

3. **Share Reports**
   - Create read-only links to share stats
   - No need to export/email files
   - Real-time updates as you add data

4. **Mobile Access**
   - Google Sheets app for iOS/Android
   - View and analyze data on the go
   - Add comments and notes

5. **Automate with Google Scripts**
   - Write Google Apps Script for custom analysis
   - Auto-generate weekly reports
   - Send email summaries

---

## 📞 Support

Having issues? Check:
1. This README
2. `USER_MANUAL.md` - Section 9: Data Export
3. Run `python quick_view.py` to verify data exists

---

## ✅ Checklist: First Time Setup

- [ ] Install Redis: `brew install redis`
- [ ] Start Redis: `brew services start redis`
- [ ] Generate some responses with system
- [ ] Run: `python quick_csv_export.py`
- [ ] Verify files in `backups/` folder
- [ ] Open Google Drive folder
- [ ] Upload CSV files
- [ ] Open in Google Sheets
- [ ] Create your first chart!

---

**🎉 You're all set! Your Mindnex.ai data is now in CSV format and ready for Google Drive!**

For JSON exports, see `README_EXPORT.md`
