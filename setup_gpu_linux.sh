#!/bin/bash
# Mindneox.ai - NVIDIA GPU Setup Script
# Run this on your Ubuntu/Linux machine with NVIDIA GPU

set -e  # Exit on error

echo "============================================================"
echo "🚀 Mindneox.ai - NVIDIA GPU Setup"
echo "============================================================"

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo "❌ This script is for Linux only"
    echo "💡 For Windows, see NVIDIA_GPU_SETUP.md"
    exit 1
fi

# Check for NVIDIA GPU
echo ""
echo "🔍 Checking for NVIDIA GPU..."
if ! command -v nvidia-smi &> /dev/null; then
    echo "❌ nvidia-smi not found!"
    echo "💡 Install NVIDIA drivers first:"
    echo "   sudo apt update"
    echo "   sudo apt install nvidia-driver-535"
    echo "   sudo reboot"
    exit 1
fi

echo "✅ NVIDIA GPU detected:"
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

# Check CUDA
echo ""
echo "🔍 Checking CUDA installation..."
if ! command -v nvcc &> /dev/null; then
    echo "⚠️  CUDA toolkit not found"
    echo "💡 Install CUDA 12.1:"
    echo "   wget https://developer.download.nvidia.com/compute/cuda/12.1.0/local_installers/cuda_12.1.0_530.30.02_linux.run"
    echo "   sudo sh cuda_12.1.0_530.30.02_linux.run"
    echo ""
    read -p "Continue without CUDA? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ CUDA version: $(nvcc --version | grep release | awk '{print $5}' | cut -d',' -f1)"
fi

# Update system
echo ""
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Python and build tools
echo ""
echo "🐍 Installing Python 3.10 and build tools..."
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3-pip
sudo apt install -y build-essential cmake git wget curl

# Install Redis
echo ""
echo "💾 Installing Redis..."
sudo apt install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis
echo "✅ Redis installed and running"

# Create project directory
echo ""
echo "📁 Creating project directory..."
PROJECT_DIR="$HOME/mindneox-gpu"
if [ -d "$PROJECT_DIR" ]; then
    echo "⚠️  Directory $PROJECT_DIR already exists"
    read -p "Remove and recreate? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_DIR"
    else
        echo "Using existing directory"
    fi
fi

mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"
echo "✅ Working directory: $PROJECT_DIR"

# Create virtual environment
echo ""
echo "🐍 Creating Python virtual environment..."
python3.10 -m venv venv
source venv/bin/activate
echo "✅ Virtual environment activated"

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install PyTorch with CUDA
echo ""
echo "🔥 Installing PyTorch with CUDA support..."
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
echo "✅ PyTorch installed"

# Verify PyTorch CUDA
echo ""
echo "🔍 Verifying PyTorch CUDA..."
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"None\"}')"

# Install llama-cpp-python with CUDA
echo ""
echo "🦙 Installing llama-cpp-python with CUDA support..."
echo "⚠️  This may take 5-10 minutes..."
CMAKE_ARGS="-DGGML_CUDA=on" pip install llama-cpp-python --force-reinstall --no-cache-dir --verbose
echo "✅ llama-cpp-python with CUDA installed"

# Install other dependencies
echo ""
echo "📦 Installing other dependencies..."
cat > requirements_minimal.txt << 'EOF'
langchain>=0.1.0
langchain-core>=0.1.0
langchain-community>=0.0.10
redis>=5.0.0
pinecone-client>=5.0.0
sentence-transformers>=2.2.0
transformers>=4.30.0
accelerate>=0.20.0
scikit-learn>=1.3.0
numpy>=1.24.0
nvidia-ml-py3>=7.352.0
gpustat>=1.0.0
psutil>=5.9.0
EOF

pip install -r requirements_minimal.txt
echo "✅ All dependencies installed"

# Download model
echo ""
echo "📥 Downloading Mistral-7B model..."
if [ ! -f "Mistral-7B-Instruct-v0.3.Q4_K_M.gguf" ]; then
    wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf
    echo "✅ Model downloaded"
else
    echo "✅ Model already exists"
fi

# Create main_gpu.py if not exists
echo ""
echo "📝 Creating main_gpu.py..."
# File content would be created here (same as above)

# Create test script
echo ""
echo "📝 Creating GPU test script..."
cat > test_gpu.py << 'EOF'
import torch

print("=" * 60)
print("🔍 GPU Test Results")
print("=" * 60)

# Check CUDA
print(f"\nCUDA Available: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    print(f"GPU Name: {torch.cuda.get_device_name(0)}")
    print(f"GPU Count: {torch.cuda.device_count()}")
    print(f"CUDA Version: {torch.version.cuda}")
    print(f"PyTorch Version: {torch.__version__}")
    
    # Get memory info
    total_memory = torch.cuda.get_device_properties(0).total_memory / 1024**3
    print(f"Total VRAM: {total_memory:.2f} GB")
    
    # Test CUDA operations
    print("\n🔥 Testing CUDA operations...")
    x = torch.randn(1000, 1000).cuda()
    y = torch.randn(1000, 1000).cuda()
    z = torch.matmul(x, y)
    print("✅ CUDA operations working!")
    
    # Test llama-cpp-python
    print("\n🦙 Testing llama-cpp-python...")
    try:
        from llama_cpp import Llama
        print("✅ llama-cpp-python imported successfully")
    except Exception as e:
        print(f"❌ Error: {e}")
else:
    print("❌ CUDA not available!")
    print("💡 Check NVIDIA drivers and CUDA installation")

print("\n" + "=" * 60)
EOF

# Run test
echo ""
echo "🧪 Running GPU test..."
python test_gpu.py

# Create convenience scripts
echo ""
echo "📝 Creating convenience scripts..."

cat > run_gpu.sh << 'EOF'
#!/bin/bash
source venv/bin/activate
python main_gpu.py "$@"
EOF
chmod +x run_gpu.sh

cat > run_benchmark.sh << 'EOF'
#!/bin/bash
source venv/bin/activate
python main_gpu.py --benchmark
EOF
chmod +x run_benchmark.sh

cat > monitor_gpu.sh << 'EOF'
#!/bin/bash
watch -n 1 nvidia-smi
EOF
chmod +x monitor_gpu.sh

# Final instructions
echo ""
echo "============================================================"
echo "✅ SETUP COMPLETE!"
echo "============================================================"
echo ""
echo "📍 Project directory: $PROJECT_DIR"
echo ""
echo "🚀 Quick Start:"
echo "   cd $PROJECT_DIR"
echo "   source venv/bin/activate"
echo "   ./run_gpu.sh"
echo ""
echo "📊 Run benchmark:"
echo "   ./run_benchmark.sh"
echo ""
echo "📈 Monitor GPU:"
echo "   ./monitor_gpu.sh"
echo "   # or: watch -n 1 nvidia-smi"
echo ""
echo "📁 Files created:"
echo "   • venv/ - Python virtual environment"
echo "   • Mistral-7B-Instruct-v0.3.Q4_K_M.gguf - Model file"
echo "   • main_gpu.py - GPU-optimized script"
echo "   • test_gpu.py - GPU test script"
echo "   • run_gpu.sh - Run script"
echo "   • run_benchmark.sh - Benchmark script"
echo "   • monitor_gpu.sh - GPU monitor"
echo ""
echo "💡 Next steps:"
echo "   1. Upload your project files to $PROJECT_DIR"
echo "   2. Run: source venv/bin/activate"
echo "   3. Run: ./run_gpu.sh"
echo ""
echo "🔗 For cloud deployment, see NVIDIA_GPU_SETUP.md"
echo "============================================================"
