#!/usr/bin/env python3
"""
Advanced Pinecone Integration with LangChain
Semantic search, RAG (Retrieval Augmented Generation), and more
"""

import os
from datetime import datetime
from typing import List, Dict, Any, Optional
import json

# Pinecone
try:
    from pinecone import Pinecone, ServerlessSpec
    PINECONE_AVAILABLE = True
except ImportError:
    PINECONE_AVAILABLE = False

# LangChain
from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Pinecone as LangChainPinecone
from langchain.chains import RetrievalQA
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

# Redis
import redis

# Configuration
PINECONE_API_KEY = "pcsk_5A9JjS_JVvYF7aE1kieuSnTXitm1pEMdVhg2wkpijQ3hiV9aC7rZ2CurG5qRfXE9FxHLAh"
INDEX_NAME = "mindnex-knowledge"
MODEL_PATH = "/Users/yeduruabhiram/Desktop/llm testing /Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"


class AdvancedMindnexRAG:
    """Advanced RAG system with Pinecone and LangChain"""
    
    def __init__(self):
        """Initialize the advanced RAG system"""
        
        if not PINECONE_AVAILABLE:
            raise ImportError("Install: pip install pinecone-client")
        
        print("\n" + "="*70)
        print("🚀 ADVANCED MINDNEX.AI - RAG WITH PINECONE")
        print("="*70)
        
        # Initialize Pinecone
        print("\n📌 Connecting to Pinecone...")
        self.pc = Pinecone(api_key=PINECONE_API_KEY)
        self.setup_index()
        
        # Initialize embeddings
        print("\n🔤 Loading embedding model...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        print("   ✅ Embeddings ready")
        
        # Initialize vector store
        self.vector_store = None
        self.setup_vector_store()
        
        # Initialize LLM
        print("\n🤖 Loading Mistral-7B...")
        self.llm = LlamaCpp(
            model_path=MODEL_PATH,
            n_gpu_layers=50,
            n_ctx=4096,
            temperature=0.7,
            max_tokens=600,
            verbose=False
        )
        print("   ✅ LLM ready")
        
        # Text splitter for documents
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len
        )
        
        print("\n✅ Advanced RAG system ready!")
    
    def setup_index(self):
        """Setup Pinecone index"""
        
        existing = [idx.name for idx in self.pc.list_indexes()]
        
        if INDEX_NAME not in existing:
            print(f"   📝 Creating index: {INDEX_NAME}")
            self.pc.create_index(
                name=INDEX_NAME,
                dimension=384,
                metric='cosine',
                spec=ServerlessSpec(cloud='aws', region='us-east-1')
            )
            print(f"   ✅ Index created")
        else:
            print(f"   ✅ Using existing index")
        
        self.index = self.pc.Index(INDEX_NAME)
    
    def setup_vector_store(self):
        """Setup LangChain Pinecone vector store"""
        
        print("\n💾 Setting up vector store...")
        
        # Initialize with existing index
        self.vector_store = LangChainPinecone(
            index=self.index,
            embedding=self.embeddings,
            text_key="text"
        )
        
        print("   ✅ Vector store ready")
    
    def add_document(
        self, 
        text: str, 
        metadata: Dict[str, Any] = None
    ) -> List[str]:
        """Add a document to the vector database"""
        
        print(f"\n📄 Adding document ({len(text)} chars)...")
        
        # Split into chunks
        chunks = self.text_splitter.split_text(text)
        print(f"   📋 Split into {len(chunks)} chunks")
        
        # Create documents
        documents = []
        for i, chunk in enumerate(chunks):
            meta = {
                'chunk_id': i,
                'total_chunks': len(chunks),
                'timestamp': datetime.now().isoformat(),
                'word_count': len(chunk.split()),
            }
            if metadata:
                meta.update(metadata)
            
            doc = Document(page_content=chunk, metadata=meta)
            documents.append(doc)
        
        # Add to vector store
        ids = self.vector_store.add_documents(documents)
        
        print(f"   ✅ Added {len(ids)} chunks to database")
        
        return ids
    
    def add_educational_content(
        self, 
        topic: str, 
        content: str, 
        age_level: int = 12,
        category: str = "general"
    ) -> List[str]:
        """Add educational content with metadata"""
        
        metadata = {
            'topic': topic,
            'age_level': age_level,
            'category': category,
            'content_type': 'educational',
            'date_added': datetime.now().strftime("%Y-%m-%d")
        }
        
        return self.add_document(content, metadata)
    
    def semantic_search(
        self, 
        query: str, 
        k: int = 5,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """Semantic search in vector database"""
        
        print(f"\n🔍 Searching: '{query}'")
        
        # Search
        results = self.vector_store.similarity_search_with_score(
            query, 
            k=k,
            filter=filter_dict
        )
        
        # Format results
        formatted = []
        for i, (doc, score) in enumerate(results, 1):
            result = {
                'content': doc.page_content,
                'score': score,
                'metadata': doc.metadata
            }
            formatted.append(result)
            
            print(f"\n   {i}. Score: {score:.4f}")
            print(f"      Topic: {doc.metadata.get('topic', 'N/A')}")
            print(f"      Preview: {doc.page_content[:100]}...")
        
        return formatted
    
    def rag_query(self, question: str, k: int = 3) -> Dict[str, Any]:
        """RAG: Retrieve relevant context and generate answer"""
        
        print("\n" + "="*70)
        print(f"❓ QUESTION: {question}")
        print("="*70)
        
        # Step 1: Retrieve relevant documents
        print("\n📚 Step 1: Retrieving relevant context...")
        docs = self.vector_store.similarity_search(question, k=k)
        
        if not docs:
            return {
                'question': question,
                'answer': "I don't have enough information to answer that question.",
                'sources': []
            }
        
        print(f"   ✅ Found {len(docs)} relevant documents")
        
        # Step 2: Build context
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # Step 3: Generate answer using LLM
        print("\n🤖 Step 2: Generating answer...")
        
        prompt = f"""Based on the following context, answer the question clearly and accurately.

Context:
{context}

Question: {question}

Answer:"""
        
        answer = self.llm.invoke(prompt).strip()
        
        print("\n✅ Answer generated!")
        print("-" * 70)
        print(answer)
        print("-" * 70)
        
        return {
            'question': question,
            'answer': answer,
            'sources': [
                {
                    'content': doc.page_content[:200],
                    'metadata': doc.metadata
                } 
                for doc in docs
            ],
            'num_sources': len(docs)
        }
    
    def create_qa_chain(self) -> RetrievalQA:
        """Create a RetrievalQA chain"""
        
        print("\n🔗 Creating QA chain...")
        
        retriever = self.vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 3}
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
        
        print("   ✅ QA chain ready")
        
        return qa_chain
    
    def add_topic_explanation(self, topic: str, age: int = 12) -> Dict:
        """Generate and store a topic explanation"""
        
        print("\n" + "="*70)
        print(f"📚 GENERATING: {topic}")
        print("="*70)
        
        # Generate explanation
        prompt = f"""You are an expert educator. Provide a comprehensive explanation 
of {topic} suitable for a {age}-year-old student. Include:
1. Clear definition
2. Key concepts
3. Real-world examples
4. Why it's important

Explanation:"""
        
        print("\n🤖 Generating explanation...")
        explanation = self.llm.invoke(prompt).strip()
        
        print(f"\n✅ Generated ({len(explanation.split())} words)")
        print("-" * 70)
        print(explanation)
        print("-" * 70)
        
        # Store in vector database
        ids = self.add_educational_content(
            topic=topic,
            content=explanation,
            age_level=age,
            category="explanation"
        )
        
        return {
            'topic': topic,
            'age': age,
            'explanation': explanation,
            'chunk_ids': ids,
            'timestamp': datetime.now().isoformat()
        }
    
    def find_related_topics(self, topic: str, k: int = 5) -> List[Dict]:
        """Find related topics in the database"""
        
        return self.semantic_search(topic, k=k)
    
    def get_statistics(self) -> Dict:
        """Get database statistics"""
        
        print("\n" + "="*70)
        print("📊 DATABASE STATISTICS")
        print("="*70)
        
        stats = self.index.describe_index_stats()
        
        info = {
            'total_vectors': stats['total_vector_count'],
            'index_name': INDEX_NAME,
            'dimensions': 384
        }
        
        print(f"\n📌 Index: {info['index_name']}")
        print(f"📊 Total chunks: {info['total_vectors']}")
        print(f"🔢 Dimensions: {info['dimensions']}")
        
        return info


def demo_basic():
    """Basic demo"""
    
    print("\n" + "="*70)
    print("🎓 BASIC DEMO: Add and Search")
    print("="*70)
    
    rag = AdvancedMindnexRAG()
    
    # Add a topic
    result = rag.add_topic_explanation("photosynthesis", age=12)
    
    # Search for related content
    results = rag.semantic_search("how do plants produce energy?", k=3)
    
    # Get stats
    rag.get_statistics()


def demo_rag():
    """RAG demo"""
    
    print("\n" + "="*70)
    print("🎓 RAG DEMO: Question Answering")
    print("="*70)
    
    rag = AdvancedMindnexRAG()
    
    # Add some educational content
    print("\n📚 Adding educational content...")
    
    rag.add_educational_content(
        topic="Solar System",
        content="""The Solar System consists of the Sun and all objects that orbit 
around it, including eight planets, their moons, asteroids, comets, and meteoroids. 
The planets are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. 
The inner planets (Mercury to Mars) are rocky, while the outer planets (Jupiter to 
Neptune) are gas giants. Earth is the only known planet with life.""",
        age_level=12,
        category="astronomy"
    )
    
    rag.add_educational_content(
        topic="Water Cycle",
        content="""The water cycle is the continuous movement of water on, above, 
and below Earth's surface. It involves evaporation (water turning to vapor), 
condensation (vapor forming clouds), precipitation (rain or snow falling), and 
collection (water gathering in rivers and oceans). This cycle is powered by the 
Sun's energy and is essential for all life on Earth.""",
        age_level=12,
        category="earth_science"
    )
    
    # Ask questions
    print("\n\n" + "="*70)
    print("ASKING QUESTIONS")
    print("="*70)
    
    result1 = rag.rag_query("How many planets are in our solar system?")
    
    result2 = rag.rag_query("What powers the water cycle?")


def interactive():
    """Interactive mode"""
    
    rag = AdvancedMindnexRAG()
    
    while True:
        print("\n" + "="*70)
        print("📋 ADVANCED RAG - MENU")
        print("="*70)
        
        print("\n1. Add topic explanation")
        print("2. Add custom document")
        print("3. Semantic search")
        print("4. Ask a question (RAG)")
        print("5. Find related topics")
        print("6. View statistics")
        print("7. Exit")
        
        choice = input("\nSelect (1-7): ").strip()
        
        if choice == '1':
            topic = input("\n📚 Topic: ").strip()
            age = input("👤 Age (default 12): ").strip()
            age = int(age) if age else 12
            rag.add_topic_explanation(topic, age)
        
        elif choice == '2':
            print("\n📄 Enter document (press Ctrl+D when done):")
            import sys
            text = sys.stdin.read()
            
            topic = input("📚 Topic: ").strip()
            category = input("📁 Category: ").strip()
            
            rag.add_educational_content(topic, text, category=category)
        
        elif choice == '3':
            query = input("\n🔍 Search query: ").strip()
            k = input("📊 Results (default 5): ").strip()
            k = int(k) if k else 5
            rag.semantic_search(query, k=k)
        
        elif choice == '4':
            question = input("\n❓ Your question: ").strip()
            rag.rag_query(question)
        
        elif choice == '5':
            topic = input("\n📚 Topic: ").strip()
            results = rag.find_related_topics(topic)
        
        elif choice == '6':
            rag.get_statistics()
        
        elif choice == '7':
            print("\n👋 Goodbye!")
            break
        
        else:
            print("\n❌ Invalid choice")


def main():
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'demo':
            demo_basic()
        elif sys.argv[1] == 'rag':
            demo_rag()
        elif sys.argv[1] == 'stats':
            rag = AdvancedMindnexRAG()
            rag.get_statistics()
        else:
            print("Usage:")
            print("  python pinecone_rag.py demo       # Basic demo")
            print("  python pinecone_rag.py rag        # RAG demo")
            print("  python pinecone_rag.py stats      # Statistics")
            print("  python pinecone_rag.py            # Interactive")
    else:
        interactive()


if __name__ == "__main__":
    main()
