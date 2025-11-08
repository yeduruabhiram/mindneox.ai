# 🗄️ Cache Storage Guide

## Where is Data Stored?

### Option 1: Redis (Persistent Storage) ✅ RECOMMENDED
- **Location**: Redis database on localhost:6379
- **Persistence**: Data survives program restarts
- **Best for**: Production use, keeping history of responses

### Option 2: In-Memory Cache (Temporary)
- **Location**: RAM (computer memory)
- **Persistence**: Lost when program ends
- **Best for**: Testing, when you don't need history

---

## 🚀 Quick Start

### 1. Start Redis Server

Choose one method:

**Option A - Run as background service:**
```bash
brew services start redis
```

**Option B - Run in terminal (stops when you close terminal):**
```bash
redis-server
```

### 2. Run Your Main Program
```bash
cd "/Users/yeduruabhiram/Desktop/llm testing "
source venv/bin/activate
python main.py
```

If Redis is running, you'll see:
```
✅ Redis cache connected! Data will persist across runs.
```

If Redis is NOT running, you'll see:
```
⚠️  Redis connection failed
💾 Using in-memory cache (data will be lost when program ends)
```

### 3. View Your Cached Data
```bash
python view_cache.py
```

This opens an interactive menu where you can:
- View all cached responses
- Search for specific cached data
- Clear the cache
- Check Redis status

---

## 📊 How Caching Works

1. **First time you ask a question**: 
   - Model generates response (slow, ~10-30 seconds)
   - Response is cached with your question as the key

2. **Same question again**:
   - Response retrieved from cache (instant, <1ms)
   - No need to run the model again!

3. **Different question**:
   - New response generated and cached

---

## 🛠️ Redis Management Commands

### Check if Redis is running
```bash
redis-cli ping
# Should return: PONG
```

### View all keys in Redis
```bash
redis-cli
> KEYS *
> EXIT
```

### Count cached items
```bash
redis-cli
> DBSIZE
> EXIT
```

### Clear all cache manually
```bash
redis-cli FLUSHDB
```

### Stop Redis
```bash
brew services stop redis
```

---

## 💡 Tips

1. **Redis not installed?**
   ```bash
   brew install redis
   ```

2. **Where is Redis data stored on disk?**
   - Default: `/usr/local/var/db/redis/`
   - Contains `dump.rdb` file (Redis database backup)

3. **Cache taking too much memory?**
   - Use `view_cache.py` to see what's cached
   - Clear old/unused entries
   - Or set expiration times

4. **Want automatic cache expiration?**
   - Redis keys can have TTL (Time To Live)
   - Currently set to never expire
   - Can be modified in the code

---

## 🔍 Example Usage

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Run your program
source venv/bin/activate
python main.py
# Enter: topic=photosynthesis, age=10

# Terminal 3: View cache
python view_cache.py
# Select option 1 to see your cached response

# Run main.py again with same inputs - instant response from cache!
```

---

## 📁 File Structure

```
llm testing/
├── main.py              # Your main LLM program
├── view_cache.py        # Cache viewer utility
├── dump.rdb             # Redis data file (auto-generated)
└── venv/                # Virtual environment
```
