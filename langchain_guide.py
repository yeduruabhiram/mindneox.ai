#!/usr/bin/env python3
"""
🚀 LangChain Integration Guide for Mindnex.ai
Complete examples of using LangChain with your local LLM
"""

from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, FewShotPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from langchain_core.globals import set_llm_cache
from langchain_community.cache import RedisCache
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
import redis
import json

# ============================================================================
# SETUP: Initialize LLM and Cache
# ============================================================================

def setup_llm():
    """Initialize the LLM with optimal settings"""
    print("🔧 Loading Mistral-7B model...")
    
    llm = LlamaCpp(
        model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
        n_ctx=4096,
        n_threads=4,
        n_gpu_layers=50,
        temperature=0.7,
        top_p=0.95,
        repeat_penalty=1.2,
        max_tokens=500,
        verbose=False
    )
    
    # Setup Redis cache
    try:
        redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
        redis_client.ping()
        set_llm_cache(RedisCache(redis_client))
        print("✅ Redis cache enabled\n")
    except:
        print("⚠️  Redis not available - continuing without cache\n")
    
    return llm


# ============================================================================
# EXAMPLE 1: Simple Prompt Template
# ============================================================================

def example1_simple_prompt():
    """Basic prompt template usage"""
    print("=" * 80)
    print("EXAMPLE 1: Simple Prompt Template")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Create a simple prompt template
    prompt = PromptTemplate(
        input_variables=["topic"],
        template="[INST] Explain {topic} in simple terms. [/INST]"
    )
    
    # Create chain
    chain = prompt | llm
    
    # Use it
    response = chain.invoke({"topic": "quantum computing"})
    print(f"Response: {response}\n")


# ============================================================================
# EXAMPLE 2: Multi-Variable Prompts
# ============================================================================

def example2_multi_variable():
    """Prompt with multiple variables"""
    print("=" * 80)
    print("EXAMPLE 2: Multi-Variable Prompts")
    print("=" * 80)
    
    llm = setup_llm()
    
    prompt = PromptTemplate(
        input_variables=["topic", "audience", "tone"],
        template="[INST] Explain {topic} for {audience} in a {tone} tone. [/INST]"
    )
    
    chain = prompt | llm
    
    response = chain.invoke({
        "topic": "artificial intelligence",
        "audience": "business executives",
        "tone": "professional"
    })
    
    print(f"Response: {response}\n")


# ============================================================================
# EXAMPLE 3: Few-Shot Learning
# ============================================================================

def example3_few_shot():
    """Few-shot prompting with examples"""
    print("=" * 80)
    print("EXAMPLE 3: Few-Shot Learning")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Define examples
    examples = [
        {
            "question": "What is Python?",
            "answer": "Python is a high-level programming language known for simplicity."
        },
        {
            "question": "What is JavaScript?",
            "answer": "JavaScript is a scripting language primarily used for web development."
        }
    ]
    
    # Create example template
    example_template = """
Question: {question}
Answer: {answer}
"""
    
    example_prompt = PromptTemplate(
        input_variables=["question", "answer"],
        template=example_template
    )
    
    # Create few-shot prompt
    few_shot_prompt = FewShotPromptTemplate(
        examples=examples,
        example_prompt=example_prompt,
        prefix="[INST] Answer the following question based on the examples:",
        suffix="Question: {input}\nAnswer: [/INST]",
        input_variables=["input"]
    )
    
    chain = few_shot_prompt | llm
    
    response = chain.invoke({"input": "What is Java?"})
    print(f"Response: {response}\n")


# ============================================================================
# EXAMPLE 4: Chain with Output Parser
# ============================================================================

def example4_output_parser():
    """Using output parsers for structured responses"""
    print("=" * 80)
    print("EXAMPLE 4: Output Parser")
    print("=" * 80)
    
    llm = setup_llm()
    
    prompt = PromptTemplate(
        input_variables=["text"],
        template="[INST] Summarize the following in one sentence: {text} [/INST]"
    )
    
    # Create chain with output parser
    chain = prompt | llm | StrOutputParser()
    
    response = chain.invoke({
        "text": "Artificial intelligence is transforming industries by automating tasks, "
                "providing insights from data, and enabling new capabilities."
    })
    
    print(f"Parsed Response: {response}\n")


# ============================================================================
# EXAMPLE 5: Parallel Chains (Multiple Tasks at Once)
# ============================================================================

def example5_parallel_chains():
    """Run multiple chains in parallel"""
    print("=" * 80)
    print("EXAMPLE 5: Parallel Chains")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Create multiple prompt templates
    summary_prompt = PromptTemplate(
        input_variables=["text"],
        template="[INST] Summarize: {text} [/INST]"
    )
    
    keywords_prompt = PromptTemplate(
        input_variables=["text"],
        template="[INST] Extract 3 keywords from: {text} [/INST]"
    )
    
    # Create parallel chain
    parallel_chain = RunnableParallel(
        summary=summary_prompt | llm,
        keywords=keywords_prompt | llm
    )
    
    text = "Machine learning is a subset of AI that enables systems to learn from data."
    
    response = parallel_chain.invoke({"text": text})
    
    print(f"Summary: {response['summary']}")
    print(f"Keywords: {response['keywords']}\n")


# ============================================================================
# EXAMPLE 6: Conversational Chain (Memory)
# ============================================================================

def example6_conversation():
    """Simulate a conversation with context"""
    print("=" * 80)
    print("EXAMPLE 6: Conversational Context")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Simple conversation template
    conversation_history = []
    
    def chat(user_input):
        # Build context from history
        context = "\n".join([f"User: {h['user']}\nAssistant: {h['assistant']}" 
                           for h in conversation_history])
        
        prompt = f"[INST] {context}\nUser: {user_input}\nAssistant: [/INST]"
        response = llm.invoke(prompt)
        
        # Store in history
        conversation_history.append({
            "user": user_input,
            "assistant": response
        })
        
        return response
    
    # Example conversation
    print("User: What is Python?")
    resp1 = chat("What is Python?")
    print(f"Assistant: {resp1}\n")
    
    print("User: What are its benefits?")
    resp2 = chat("What are its benefits?")
    print(f"Assistant: {resp2}\n")


# ============================================================================
# EXAMPLE 7: Conditional Chain (Routing)
# ============================================================================

def example7_routing():
    """Route to different chains based on input"""
    print("=" * 80)
    print("EXAMPLE 7: Conditional Routing")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Create different prompt templates for different tasks
    code_prompt = PromptTemplate(
        input_variables=["question"],
        template="[INST] Answer this programming question: {question} [/INST]"
    )
    
    general_prompt = PromptTemplate(
        input_variables=["question"],
        template="[INST] Answer this general question: {question} [/INST]"
    )
    
    def route_question(question):
        """Determine which chain to use"""
        code_keywords = ["code", "python", "programming", "function", "variable"]
        
        if any(keyword in question.lower() for keyword in code_keywords):
            return (code_prompt | llm).invoke({"question": question})
        else:
            return (general_prompt | llm).invoke({"question": question})
    
    # Test routing
    q1 = "How do I write a Python function?"
    print(f"Question: {q1}")
    print(f"Response: {route_question(q1)}\n")
    
    q2 = "What is the capital of France?"
    print(f"Question: {q2}")
    print(f"Response: {route_question(q2)}\n")


# ============================================================================
# EXAMPLE 8: Advanced Chain with Preprocessing
# ============================================================================

def example8_preprocessing():
    """Chain with data preprocessing"""
    print("=" * 80)
    print("EXAMPLE 8: Chain with Preprocessing")
    print("=" * 80)
    
    llm = setup_llm()
    
    def preprocess(inputs):
        """Preprocess input data"""
        text = inputs["text"]
        # Example: Clean and format text
        cleaned = text.strip().lower()
        word_count = len(cleaned.split())
        return {
            "text": cleaned,
            "word_count": word_count
        }
    
    prompt = PromptTemplate(
        input_variables=["text", "word_count"],
        template="[INST] This text has {word_count} words. Analyze: {text} [/INST]"
    )
    
    # Create chain with preprocessing
    chain = RunnablePassthrough() | preprocess | prompt | llm
    
    response = chain.invoke({
        "text": "  ARTIFICIAL INTELLIGENCE is REVOLUTIONARY  "
    })
    
    print(f"Response: {response}\n")


# ============================================================================
# EXAMPLE 9: Educational Tutor (Mindnex.ai Use Case)
# ============================================================================

def example9_educational_tutor():
    """Complete educational assistant example"""
    print("=" * 80)
    print("EXAMPLE 9: Educational Tutor for Mindnex.ai")
    print("=" * 80)
    
    llm = setup_llm()
    
    # Create comprehensive educational prompt
    tutor_prompt = PromptTemplate(
        input_variables=["topic", "difficulty", "learning_style"],
        template="""[INST] You are an educational tutor.

Topic: {topic}
Difficulty Level: {difficulty}
Learning Style: {learning_style}

Provide a comprehensive explanation that:
1. Introduces the concept clearly
2. Uses examples relevant to the learning style
3. Includes a practical application
4. Ends with a quick quiz question

[/INST]"""
    )
    
    chain = tutor_prompt | llm
    
    response = chain.invoke({
        "topic": "photosynthesis",
        "difficulty": "high school",
        "learning_style": "visual learner with examples"
    })
    
    print(f"Tutor Response:\n{response}\n")


# ============================================================================
# MAIN MENU
# ============================================================================

def main():
    print("\n" + "=" * 80)
    print("🎓 LangChain Integration Examples for Mindnex.ai")
    print("=" * 80)
    
    examples = {
        "1": ("Simple Prompt Template", example1_simple_prompt),
        "2": ("Multi-Variable Prompts", example2_multi_variable),
        "3": ("Few-Shot Learning", example3_few_shot),
        "4": ("Output Parser", example4_output_parser),
        "5": ("Parallel Chains", example5_parallel_chains),
        "6": ("Conversational Context", example6_conversation),
        "7": ("Conditional Routing", example7_routing),
        "8": ("Chain with Preprocessing", example8_preprocessing),
        "9": ("Educational Tutor (Mindnex.ai)", example9_educational_tutor),
    }
    
    print("\nAvailable Examples:")
    for key, (name, _) in examples.items():
        print(f"  {key}. {name}")
    print("  0. Run all examples")
    print("  q. Quit")
    
    choice = input("\nEnter choice: ").strip()
    
    if choice == "0":
        for _, func in examples.values():
            func()
            print("\n")
    elif choice in examples:
        examples[choice][1]()
    elif choice.lower() == "q":
        print("Goodbye!")
    else:
        print(" Invalid choice")


if __name__ == "__main__":
    main()
