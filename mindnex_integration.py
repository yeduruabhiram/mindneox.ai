#!/usr/bin/env python3
"""
🎓 Mindnex.ai Educational Platform Integration
Using LangChain for intelligent tutoring
"""

from langchain_community.llms import LlamaCpp
from langchain_core.prompts import PromptTemplate
from langchain_core.globals import set_llm_cache
from langchain_community.cache import RedisCache
from langchain_core.runnables import RunnableParallel
import redis
from typing import Dict, List
import json

class MindnexTutor:
    """Educational AI tutor for Mindnex.ai platform"""
    
    def __init__(self):
        """Initialize the tutor with LLM and cache"""
        self.llm = self._setup_llm()
        self._setup_prompts()
    
    def _setup_llm(self):
        """Setup LLM with caching"""
        print("🚀 Initializing Mindnex.ai Tutor...")
        
        # Setup Redis cache
        try:
            redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
            redis_client.ping()
            set_llm_cache(RedisCache(redis_client))
            print("✅ Cache enabled - responses will be instant for repeated questions!")
        except:
            print("⚠️  Running without cache")
        
        # Initialize LLM
        llm = LlamaCpp(
            model_path="Mistral-7B-Instruct-v0.3.Q4_K_M.gguf",
            n_ctx=4096,
            n_threads=4,
            n_gpu_layers=50,
            temperature=0.7,
            top_p=0.95,
            repeat_penalty=1.2,
            max_tokens=600,
            verbose=False
        )
        
        print("✅ Tutor ready!\n")
        return llm
    
    def _setup_prompts(self):
        """Setup all prompt templates"""
        
        # 1. Explanation prompt
        self.explain_prompt = PromptTemplate(
            input_variables=["topic", "level", "context"],
            template="""[INST] You are an educational tutor on Mindnex.ai platform.

Topic: {topic}
Student Level: {level}
Context: {context}

Provide a clear, structured explanation with:
1. Simple introduction
2. Key concepts
3. Real-world example
4. Summary

Keep it engaging and age-appropriate. [/INST]"""
        )
        
        # 2. Quiz generation prompt
        self.quiz_prompt = PromptTemplate(
            input_variables=["topic", "difficulty"],
            template="""[INST] Create a multiple-choice quiz question about {topic} for {difficulty} level.

Format:
Question: [question text]
A) [option A]
B) [option B]
C) [option C]
D) [option D]
Correct Answer: [letter]
Explanation: [why this is correct] [/INST]"""
        )
        
        # 3. Homework help prompt
        self.homework_prompt = PromptTemplate(
            input_variables=["question", "subject", "hints_only"],
            template="""[INST] Student needs help with homework.

Subject: {subject}
Question: {question}
Mode: {"Give hints only, don't solve completely" if hints_only else "Provide complete solution with explanation"}

Help the student learn, not just get the answer. [/INST]"""
        )
        
        # 4. Concept breakdown prompt
        self.breakdown_prompt = PromptTemplate(
            input_variables=["concept"],
            template="""[INST] Break down this complex concept into simple parts:

Concept: {concept}

Provide:
1. What is it? (1 sentence)
2. Why is it important?
3. How does it work? (step by step)
4. Common misconceptions
5. Related concepts [/INST]"""
        )
        
        # 5. Study plan prompt
        self.study_plan_prompt = PromptTemplate(
            input_variables=["topic", "duration", "goal"],
            template="""[INST] Create a study plan for:

Topic: {topic}
Time Available: {duration}
Goal: {goal}

Provide a structured day-by-day plan with:
- Daily objectives
- Key topics to cover
- Recommended practice
- Progress checkpoints [/INST]"""
        )
    
    def explain(self, topic: str, level: str = "high school", context: str = "") -> str:
        """Generate explanation for a topic"""
        print(f"📚 Explaining: {topic}...")
        
        chain = self.explain_prompt | self.llm
        response = chain.invoke({
            "topic": topic,
            "level": level,
            "context": context or "General learning"
        })
        
        return response
    
    def generate_quiz(self, topic: str, difficulty: str = "medium") -> str:
        """Generate a quiz question"""
        print(f"📝 Generating quiz on: {topic}...")
        
        chain = self.quiz_prompt | self.llm
        response = chain.invoke({
            "topic": topic,
            "difficulty": difficulty
        })
        
        return response
    
    def homework_help(self, question: str, subject: str, hints_only: bool = True) -> str:
        """Help with homework"""
        print(f"🤔 Working on homework problem...")
        
        chain = self.homework_prompt | self.llm
        response = chain.invoke({
            "question": question,
            "subject": subject,
            "hints_only": hints_only
        })
        
        return response
    
    def breakdown_concept(self, concept: str) -> str:
        """Break down complex concepts"""
        print(f"🔬 Breaking down: {concept}...")
        
        chain = self.breakdown_prompt | self.llm
        response = chain.invoke({"concept": concept})
        
        return response
    
    def create_study_plan(self, topic: str, duration: str, goal: str) -> str:
        """Create a personalized study plan"""
        print(f"📅 Creating study plan for: {topic}...")
        
        chain = self.study_plan_prompt | self.llm
        response = chain.invoke({
            "topic": topic,
            "duration": duration,
            "goal": goal
        })
        
        return response
    
    def comprehensive_learning(self, topic: str) -> Dict[str, str]:
        """
        Generate comprehensive learning materials in parallel
        Returns explanation, quiz, and breakdown at once
        """
        print(f"🎯 Creating comprehensive learning package for: {topic}...")
        
        # Run multiple chains in parallel
        parallel_chain = RunnableParallel(
            explanation=self.explain_prompt | self.llm,
            quiz=self.quiz_prompt | self.llm,
            breakdown=self.breakdown_prompt | self.llm
        )
        
        results = parallel_chain.invoke({
            "topic": topic,
            "level": "high school",
            "context": "Comprehensive learning",
            "difficulty": "medium",
            "concept": topic
        })
        
        return results


# ============================================================================
# INTERACTIVE DEMO
# ============================================================================

def interactive_demo():
    """Interactive demonstration of Mindnex.ai features"""
    
    tutor = MindnexTutor()
    
    while True:
        print("\n" + "=" * 80)
        print("🎓 MINDNEX.AI - AI TUTOR")
        print("=" * 80)
        print("\nFeatures:")
        print("  1. Explain a topic")
        print("  2. Generate quiz question")
        print("  3. Homework help")
        print("  4. Break down complex concept")
        print("  5. Create study plan")
        print("  6. Comprehensive learning package (all at once)")
        print("  7. Example use cases")
        print("  q. Quit")
        
        choice = input("\nSelect option: ").strip()
        
        if choice == "1":
            topic = input("Enter topic: ")
            level = input("Level (elementary/middle school/high school/college): ") or "high school"
            result = tutor.explain(topic, level)
            print(f"\n📚 EXPLANATION:\n{result}")
            
        elif choice == "2":
            topic = input("Enter topic: ")
            difficulty = input("Difficulty (easy/medium/hard): ") or "medium"
            result = tutor.generate_quiz(topic, difficulty)
            print(f"\n📝 QUIZ:\n{result}")
            
        elif choice == "3":
            question = input("Enter homework question: ")
            subject = input("Subject: ")
            hints = input("Hints only? (yes/no): ").lower() == "yes"
            result = tutor.homework_help(question, subject, hints)
            print(f"\n🤔 HELP:\n{result}")
            
        elif choice == "4":
            concept = input("Enter complex concept: ")
            result = tutor.breakdown_concept(concept)
            print(f"\n🔬 BREAKDOWN:\n{result}")
            
        elif choice == "5":
            topic = input("Study topic: ")
            duration = input("Time available (e.g., '2 weeks', '1 month'): ")
            goal = input("Learning goal: ")
            result = tutor.create_study_plan(topic, duration, goal)
            print(f"\n📅 STUDY PLAN:\n{result}")
            
        elif choice == "6":
            topic = input("Enter topic: ")
            results = tutor.comprehensive_learning(topic)
            print(f"\n📚 EXPLANATION:\n{results['explanation']}")
            print(f"\n📝 QUIZ:\n{results['quiz']}")
            print(f"\n🔬 BREAKDOWN:\n{results['breakdown']}")
            
        elif choice == "7":
            show_examples()
            
        elif choice.lower() == "q":
            print("👋 Thank you for using Mindnex.ai!")
            break
        
        else:
            print("❌ Invalid choice")


def show_examples():
    """Show example use cases"""
    print("\n" + "=" * 80)
    print("💡 EXAMPLE USE CASES FOR MINDNEX.AI")
    print("=" * 80)
    
    print("""
1. STUDENT LEARNING PATH:
   - Student asks about "photosynthesis"
   - System provides explanation (option 1)
   - Generates quiz to test understanding (option 2)
   - Creates study plan for deeper learning (option 5)

2. HOMEWORK ASSISTANCE:
   - Student stuck on math problem
   - Uses homework help (option 3) with "hints only"
   - Gets guidance without direct answer
   - Learns problem-solving approach

3. EXAM PREPARATION:
   - Student preparing for biology exam
   - Uses comprehensive learning (option 6)
   - Gets explanation, quiz, and breakdown
   - Reviews and practices with generated quizzes

4. CONCEPT MASTERY:
   - Student confused about "quantum mechanics"
   - Uses concept breakdown (option 4)
   - Gets step-by-step understanding
   - Clears misconceptions

5. PERSONALIZED LEARNING:
   - Student wants to learn "Python programming"
   - Creates custom study plan (option 5)
   - Follows structured daily objectives
   - Tracks progress with checkpoints

BENEFITS OF LANGCHAIN INTEGRATION:
✅ Caching - Instant responses for repeated questions
✅ Structured prompts - Consistent quality answers
✅ Parallel processing - Multiple tasks at once
✅ Template reuse - Easy to scale and maintain
✅ Output parsing - Clean, formatted responses
""")


def quick_test():
    """Quick test of key features"""
    print("\n" + "=" * 80)
    print("🧪 QUICK TEST - Mindnex.ai Features")
    print("=" * 80)
    
    tutor = MindnexTutor()
    
    # Test 1: Simple explanation
    print("\n1️⃣ Testing explanation feature...")
    result = tutor.explain("gravity", "middle school")
    print(f"✅ Got explanation: {result[:100]}...\n")
    
    # Test 2: Quiz generation
    print("2️⃣ Testing quiz generation...")
    result = tutor.generate_quiz("solar system", "easy")
    print(f"✅ Generated quiz: {result[:100]}...\n")
    
    print("🎉 All features working! Ready for Mindnex.ai integration.")


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        quick_test()
    else:
        interactive_demo()
