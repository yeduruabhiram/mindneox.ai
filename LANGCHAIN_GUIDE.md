# 🚀 LangChain with Mindnex.ai - Quick Reference

## 📚 What is LangChain?

LangChain is a framework for building applications with Large Language Models (LLMs). It helps you:
- Create reusable prompt templates
- Chain multiple LLM calls together
- Cache responses for speed
- Parse and structure outputs
- Build complex AI workflows

---

## 🎯 Key Concepts

### 1. **Prompt Templates**
Create reusable prompts with variables:

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate(
    input_variables=["topic", "age"],
    template="[INST] Explain {topic} for a {age} year old [/INST]"
)
```

### 2. **Chains**
Connect prompts and LLMs:

```python
chain = prompt | llm
response = chain.invoke({"topic": "AI", "age": "10"})
```

### 3. **Caching**
Store responses to avoid recomputation:

```python
from langchain_community.cache import RedisCache
set_llm_cache(RedisCache(redis_client))
```

### 4. **Parallel Execution**
Run multiple tasks simultaneously:

```python
from langchain_core.runnables import RunnableParallel

parallel = RunnableParallel(
    summary=summary_prompt | llm,
    quiz=quiz_prompt | llm
)
```

---

## 🎓 Mindnex.ai Use Cases

### Use Case 1: Educational Explanations
```python
# Single explanation
explanation = tutor.explain(
    topic="photosynthesis",
    level="high school"
)
```

### Use Case 2: Quiz Generation
```python
# Generate practice questions
quiz = tutor.generate_quiz(
    topic="algebra",
    difficulty="medium"
)
```

### Use Case 3: Homework Help
```python
# Help without giving direct answers
help = tutor.homework_help(
    question="Solve x² + 5x + 6 = 0",
    subject="algebra",
    hints_only=True
)
```

### Use Case 4: Study Plans
```python
# Personalized learning path
plan = tutor.create_study_plan(
    topic="Python programming",
    duration="2 weeks",
    goal="Build basic web apps"
)
```

### Use Case 5: Comprehensive Learning
```python
# Get everything at once (parallel execution)
materials = tutor.comprehensive_learning("quantum physics")
# Returns: explanation, quiz, and concept breakdown
```

---

## 🚀 Getting Started

### Step 1: Install Dependencies
Already done! You have:
- ✅ langchain-core
- ✅ langchain-community
- ✅ llama-cpp-python
- ✅ redis

### Step 2: Start Redis (for caching)
```bash
brew services start redis
```

### Step 3: Run the Examples
```bash
# Learn LangChain basics
python langchain_guide.py

# Try Mindnex.ai integration
python mindnex_integration.py

# Quick test
python mindnex_integration.py test
```

---

## 📊 Current Files

### 1. `main.py`
Your original educational explainer with caching.

### 2. `langchain_guide.py` (NEW)
9 complete examples of LangChain features:
- Simple prompts
- Multi-variable prompts
- Few-shot learning
- Output parsers
- Parallel chains
- Conversational context
- Conditional routing
- Preprocessing
- Educational tutor

### 3. `mindnex_integration.py` (NEW)
Complete Mindnex.ai platform integration:
- `MindnexTutor` class
- 5 educational features
- Interactive demo
- Parallel processing
- Redis caching

### 4. `quick_view.py`
View cached data in Redis.

### 5. `view_cache.py`
Full-featured cache management tool.

---

## 💡 LangChain Benefits for Mindnex.ai

### 1. **Speed** ⚡
- Cache responses → instant replies for common questions
- Parallel processing → generate multiple materials at once

### 2. **Quality** ✨
- Structured prompts → consistent answers
- Template system → easy to improve and test

### 3. **Scalability** 📈
- Reusable components
- Easy to add new features
- Maintainable codebase

### 4. **Flexibility** 🔧
- Different prompts for different age groups
- Customizable difficulty levels
- Adaptive learning paths

### 5. **Cost Efficiency** 💰
- Local LLM (no API costs)
- Caching reduces computation
- Apple Silicon GPU acceleration

---

## 🎯 Integration Architecture

```
┌─────────────────────────────────────────────────┐
│            Mindnex.ai Platform                  │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ Student  │  │ Teacher  │  │  Admin   │    │
│  │Interface │  │Dashboard │  │ Panel    │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       │             │              │           │
│       └─────────────┴──────────────┘           │
│                     ↓                          │
│       ┌─────────────────────────────┐         │
│       │   MindnexTutor (LangChain)  │         │
│       │  - explain()                │         │
│       │  - generate_quiz()          │         │
│       │  - homework_help()          │         │
│       │  - create_study_plan()      │         │
│       └─────────────┬───────────────┘         │
│                     ↓                          │
│       ┌─────────────────────────────┐         │
│       │  Mistral-7B (Local LLM)     │         │
│       │  + Apple Silicon GPU        │         │
│       └─────────────┬───────────────┘         │
│                     ↓                          │
│       ┌─────────────────────────────┐         │
│       │    Redis Cache               │         │
│       │    (Fast Responses)          │         │
│       └─────────────────────────────┘         │
└─────────────────────────────────────────────────┘
```

---

## 🔥 Quick Commands

```bash
# Start everything
brew services start redis
cd "/Users/yeduruabhiram/Desktop/llm testing "
source venv/bin/activate

# Run interactive tutor
python mindnex_integration.py

# View examples
python langchain_guide.py

# Check cache
python quick_view.py

# Your original program
python main.py
```

---

## 📖 Learn More

### LangChain Documentation
- Prompts: https://python.langchain.com/docs/modules/prompts/
- Chains: https://python.langchain.com/docs/modules/chains/
- Caching: https://python.langchain.com/docs/modules/model_io/caching/

### Your Next Steps
1. ✅ Run `python langchain_guide.py` to see all examples
2. ✅ Try `python mindnex_integration.py` for the tutor
3. ✅ Modify prompts in `mindnex_integration.py` for your needs
4. ✅ Integrate into your main Mindnex.ai codebase

---

## 🎉 You're Ready!

You now have:
- ✅ Working LangChain integration
- ✅ Redis caching for speed
- ✅ Complete educational tutor
- ✅ Multiple examples to learn from
- ✅ Production-ready code

**Start with:** `python mindnex_integration.py`
