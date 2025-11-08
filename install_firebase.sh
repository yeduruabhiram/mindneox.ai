#!/bin/bash

echo "================================================"
echo "🔥 Firebase Chatbot - Installation Script"
echo "================================================"
echo ""

# Check Python version
echo "📋 Checking Python version..."
python3 --version

if [ $? -ne 0 ]; then
    echo "❌ Python 3 not found. Please install Python 3.8 or higher."
    exit 1
fi

echo "✅ Python found!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pip3 install firebase-admin sentence-transformers llama-cpp-python langchain-community

if [ $? -ne 0 ]; then
    echo "❌ Installation failed. Please check your internet connection."
    exit 1
fi

echo "✅ Dependencies installed!"
echo ""

# Check if model exists
echo "🤖 Checking for AI model..."
if [ -f "Mistral-7B-Instruct-v0.3.Q4_K_M.gguf" ]; then
    echo "✅ AI model found!"
else
    echo "⚠️  AI model not found!"
    echo ""
    echo "Please download the model:"
    echo "  Model: Mistral-7B-Instruct-v0.3.Q4_K_M.gguf"
    echo "  Place it in: $(pwd)"
    echo ""
fi

# Check if firebase_chatbot.py exists
echo "📄 Checking for chatbot file..."
if [ -f "firebase_chatbot.py" ]; then
    echo "✅ Chatbot file found!"
else
    echo "❌ firebase_chatbot.py not found in current directory!"
    exit 1
fi

echo ""
echo "================================================"
echo "✅ Installation Complete!"
echo "================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Get Firebase Service Account Key:"
echo "   • Go to: https://console.firebase.google.com/"
echo "   • Project Settings → Service Accounts"
echo "   • Generate New Private Key"
echo ""
echo "2. Update firebase_chatbot.py:"
echo "   • Open firebase_chatbot.py"
echo "   • Replace FIREBASE_CONFIG with your key"
echo ""
echo "3. Run the chatbot:"
echo "   python3 firebase_chatbot.py"
echo ""
echo "📚 Read FIREBASE_SETUP.md for detailed instructions"
echo ""
echo "🚀 Happy chatting!"
echo ""
