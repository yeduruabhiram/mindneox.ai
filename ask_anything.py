#!/usr/bin/env python3
"""
Mindneox.ai - Ask Anything Feature
Universal question answering with web search integration
"""

from llama_cpp import Llama
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.globals import set_llm_cache
from langchain_core.caches import InMemoryCache
from langchain_community.cache import RedisCache
import redis
import hashlib
from datetime import datetime
import json
import re

# Pinecone integration
try:
    from pinecone import Pinecone
    from langchain_community.embeddings import HuggingFaceEmbeddings
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

# Web search integration (optional)
try:
    import requests
    WEB_SEARCH_AVAILABLE = True
except ImportError:
    WEB_SEARCH_AVAILABLE = False


class AskAnythingAssistant:
    """Universal question answering assistant"""
    
    def __init__(self):
        """Initialize the assistant"""
        print("=" * 70)
        print("🌐 MINDNEOX.AI - ASK ANYTHING")
        print("Universal AI Assistant with Web Search & Smart Answers")
        print("=" * 70)
        
        # Initialize caching
        self._init_cache()
        
        # Initialize Pinecone
        self._init_pinecone()
        
        # Initialize LLM
        self._init_llm()
        
        # Initialize prompts
        self._init_prompts()
        
        print("\n✅ Ask Anything Assistant Ready!")
        print("="*70 + "\n")
    
    def _init_cache(self):
        """Initialize Redis cache"""
        print("\n📦 Initializing cache...")
        try:
            self.redis_client = redis.Redis(
                host='localhost', 
                port=6379, 
                db=0, 
                decode_responses=True
            )
            self.redis_client.ping()
            set_llm_cache(RedisCache(self.redis_client))
            print("✅ Redis cache connected!\n")
        except Exception as e:
            print(f"⚠️  Redis connection failed: {e}")
            print("💾 Using in-memory cache.\n")
            set_llm_cache(InMemoryCache())
            self.redis_client = None
    
    def _init_pinecone(self):
        """Initialize Pinecone vector database"""
        self.pinecone_index = None
        self.embeddings = None
        
        if PINECONE_AVAILABLE:
            try:
                print("🔗 Connecting to Pinecone...")
                PINECONE_API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
                INDEX_NAME = "mindnex-responses"
                
                pc = Pinecone(api_key=PINECONE_API_KEY)
                self.pinecone_index = pc.Index(INDEX_NAME)
                
                # Initialize embeddings
                print("🔤 Loading embedding model...")
                self.embeddings = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2",
                    model_kwargs={'device': 'cpu'}
                )
                
                stats = self.pinecone_index.describe_index_stats()
                print(f"✅ Pinecone connected! ({stats['total_vector_count']} vectors)\n")
            except Exception as e:
                print(f"⚠️  Pinecone error: {e}\n")
        else:
            print("⚠️  Pinecone not installed.\n")
    
    def _init_llm(self):
        """Initialize LLM"""
        print("🤖 Loading Mistral-7B model...")
        
        self.llm = LlamaCpp(
            model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
            n_ctx=4096,
            n_threads=4,
            n_gpu_layers=50,
            temperature=0.7,
            top_p=0.95,
            repeat_penalty=1.2,
            max_tokens=800,  # Longer responses for complex questions
            verbose=False
        )
        
        print("✅ Model loaded!\n")
    
    def _init_prompts(self):
        """Initialize prompt templates"""
        
        # Question analysis prompt
        self.analyze_prompt = PromptTemplate(
            input_variables=["question"],
            template="""[INST] Analyze this question and identify:
1. Main topic
2. Question type (factual, opinion, how-to, definition, comparison, etc.)
3. Key concepts needed to answer

Question: {question}

Provide brief analysis. [/INST]"""
        )
        
        # Comprehensive answer prompt
        self.answer_prompt = PromptTemplate(
            input_variables=["question", "analysis"],
            template="""[INST] You are a knowledgeable AI assistant. Answer this question comprehensively.

Question: {question}

Analysis: {analysis}

Provide a detailed, accurate answer that:
1. Directly answers the question
2. Provides context and background
3. Includes relevant examples
4. Mentions key facts or figures
5. Is well-structured and clear

Answer: [/INST]"""
        )
        
        # Summarization prompt
        self.summarize_prompt = PromptTemplate(
            input_variables=["question", "answer"],
            template="""[INST] Summarize this Q&A in 2-3 sentences:

Question: {question}
Answer: {answer}

Summary: [/INST]"""
        )
        
        # Web resource suggestion prompt
        self.resources_prompt = PromptTemplate(
            input_variables=["question", "topic"],
            template="""[INST] Suggest 3-5 relevant websites or resources to learn more about: {topic}

Question context: {question}

List website names and brief descriptions (no actual URLs, just suggest types of sites). [/INST]"""
        )
    
    def analyze_question(self, question: str) -> str:
        """Analyze the question to understand what's being asked"""
        print("🔍 Analyzing question...")
        
        chain = self.analyze_prompt | self.llm
        analysis = chain.invoke({"question": question})
        
        return analysis.strip()
    
    def generate_answer(self, question: str, analysis: str) -> str:
        """Generate comprehensive answer"""
        print("💭 Thinking and generating answer...")
        
        chain = self.answer_prompt | self.llm
        answer = chain.invoke({
            "question": question,
            "analysis": analysis
        })
        
        return answer.strip()
    
    def summarize(self, question: str, answer: str) -> str:
        """Create brief summary"""
        print("📝 Creating summary...")
        
        chain = self.summarize_prompt | self.llm
        summary = chain.invoke({
            "question": question,
            "answer": answer
        })
        
        return summary.strip()
    
    def suggest_resources(self, question: str, topic: str) -> str:
        """Suggest relevant learning resources"""
        print("🌐 Suggesting resources...")
        
        chain = self.resources_prompt | self.llm
        resources = chain.invoke({
            "question": question,
            "topic": topic
        })
        
        return resources.strip()
    
    def extract_topic(self, analysis: str) -> str:
        """Extract main topic from analysis"""
        # Simple extraction - look for "Main topic:" or similar
        lines = analysis.lower().split('\n')
        for line in lines:
            if 'main topic' in line or 'topic:' in line:
                # Extract after colon
                if ':' in line:
                    return line.split(':', 1)[1].strip()
        
        # Fallback: use first few words
        return analysis.split('.')[0][:50]
    
    def store_in_pinecone(self, question: str, answer: str, analysis: str):
        """Store Q&A in Pinecone"""
        
        if not self.pinecone_index or not self.embeddings:
            return None
        
        try:
            print("\n💾 Storing in knowledge base...")
            
            # Combine question and answer for embedding
            full_text = f"Question: {question}\n\nAnswer: {answer}"
            embedding = self.embeddings.embed_query(full_text)
            
            # Create unique ID
            vector_id = f"askanything_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{hash(question) % 10000}"
            
            # Extract topic from analysis
            topic = self.extract_topic(analysis)
            
            # Prepare metadata
            metadata = {
                'question': question,
                'answer': answer[:1000],  # Truncate for metadata storage
                'topic': topic,
                'analysis': analysis[:500],
                'type': 'ask_anything',
                'word_count': len(answer.split()),
                'character_count': len(answer),
                'timestamp': datetime.now().isoformat(),
                'preview': answer[:200]
            }
            
            # Store in Pinecone
            self.pinecone_index.upsert(
                vectors=[{
                    'id': vector_id,
                    'values': embedding,
                    'metadata': metadata
                }]
            )
            
            print(f"   ✅ Stored with ID: {vector_id}")
            
            return vector_id
            
        except Exception as e:
            print(f"   ⚠️  Storage failed: {e}")
            return None
    
    def ask_anything(self, question: str, include_resources: bool = True) -> dict:
        """
        Main method: Answer any question comprehensively
        
        Args:
            question: The question to answer
            include_resources: Whether to suggest learning resources
            
        Returns:
            Dictionary with analysis, answer, summary, and resources
        """
        
        print("\n" + "="*70)
        print(f"❓ QUESTION: {question}")
        print("="*70 + "\n")
        
        # Step 1: Analyze the question
        analysis = self.analyze_question(question)
        
        print(f"\n📊 ANALYSIS:\n{analysis}\n")
        print("-" * 70)
        
        # Step 2: Generate comprehensive answer
        answer = self.generate_answer(question, analysis)
        
        print(f"\n💡 ANSWER:\n{answer}\n")
        print("-" * 70)
        
        # Step 3: Create summary
        summary = self.summarize(question, answer)
        
        print(f"\n📝 SUMMARY:\n{summary}\n")
        print("-" * 70)
        
        # Step 4: Suggest resources (optional)
        resources = None
        if include_resources:
            topic = self.extract_topic(analysis)
            resources = self.suggest_resources(question, topic)
            
            print(f"\n🌐 LEARNING RESOURCES:\n{resources}\n")
            print("-" * 70)
        
        # Step 5: Store in Pinecone
        vector_id = self.store_in_pinecone(question, answer, analysis)
        
        # Return structured result
        result = {
            'question': question,
            'analysis': analysis,
            'answer': answer,
            'summary': summary,
            'resources': resources,
            'vector_id': vector_id,
            'timestamp': datetime.now().isoformat()
        }
        
        return result
    
    def search_similar_questions(self, question: str, top_k: int = 3):
        """Search for similar questions previously asked"""
        
        if not self.pinecone_index or not self.embeddings:
            print("⚠️  Pinecone not available for search")
            return []
        
        try:
            print(f"\n🔍 Searching for similar questions...")
            
            # Generate embedding for search
            query_embedding = self.embeddings.embed_query(question)
            
            # Search Pinecone
            results = self.pinecone_index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter={'type': {'$eq': 'ask_anything'}}
            )
            
            if results['matches']:
                print(f"\n📚 Found {len(results['matches'])} similar questions:\n")
                
                similar = []
                for i, match in enumerate(results['matches'], 1):
                    metadata = match['metadata']
                    score = match['score']
                    
                    print(f"{i}. Question: {metadata.get('question', 'N/A')}")
                    print(f"   Similarity: {score:.3f}")
                    print(f"   Topic: {metadata.get('topic', 'N/A')}")
                    print(f"   Answer preview: {metadata.get('preview', 'N/A')[:100]}...")
                    print()
                    
                    similar.append({
                        'question': metadata.get('question'),
                        'answer': metadata.get('answer'),
                        'topic': metadata.get('topic'),
                        'score': score
                    })
                
                return similar
            else:
                print("No similar questions found.\n")
                return []
                
        except Exception as e:
            print(f"⚠️  Search error: {e}")
            return []
    
    def interactive_mode(self):
        """Run in interactive mode"""
        
        print("\n" + "="*70)
        print("🌐 ASK ANYTHING - INTERACTIVE MODE")
        print("="*70)
        print("\nType your questions and get comprehensive answers!")
        print("Commands:")
        print("  - Type 'search' to search similar questions")
        print("  - Type 'quit' or 'exit' to stop")
        print("  - Type 'help' for more options")
        print("="*70 + "\n")
        
        while True:
            try:
                user_input = input("\n💬 Your question: ").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                if user_input.lower() in ['quit', 'exit', 'q']:
                    print("\n👋 Goodbye! Thanks for using Ask Anything!")
                    break
                
                elif user_input.lower() == 'help':
                    print("\n📖 HELP:")
                    print("  - Ask any question naturally")
                    print("  - Get detailed answers with analysis")
                    print("  - Receive learning resource suggestions")
                    print("  - Search for similar past questions")
                    print("  - All Q&As saved to knowledge base")
                    continue
                
                elif user_input.lower() == 'search':
                    search_query = input("🔍 Search for: ").strip()
                    if search_query:
                        self.search_similar_questions(search_query)
                    continue
                
                # Process question
                include_resources = input("Include learning resources? (y/n, default: y): ").strip().lower()
                include_resources = include_resources != 'n'
                
                result = self.ask_anything(user_input, include_resources)
                
                # Offer to search similar
                search_similar = input("\n🔍 Search for similar questions? (y/n): ").strip().lower()
                if search_similar == 'y':
                    self.search_similar_questions(user_input)
                
                print("\n" + "="*70)
                
            except KeyboardInterrupt:
                print("\n\n👋 Interrupted. Goodbye!")
                break
            except Exception as e:
                print(f"\n❌ Error: {e}")
                import traceback
                traceback.print_exc()


def main():
    """Main function"""
    
    # Create assistant
    assistant = AskAnythingAssistant()
    
    # Check if arguments provided
    import sys
    if len(sys.argv) > 1:
        # Non-interactive mode with question as argument
        question = ' '.join(sys.argv[1:])
        result = assistant.ask_anything(question)
        
        # Save to file
        output_file = f"answer_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
        print(f"\n💾 Saved to: {output_file}")
    else:
        # Interactive mode
        assistant.interactive_mode()


if __name__ == "__main__":
    main()
