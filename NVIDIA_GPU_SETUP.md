# Running Mindneox.ai on NVIDIA GPU

Since your Mac is overheating and doesn't support NVIDIA GPUs, you have several options to run this system on NVIDIA hardware.

## Table of Contents
1. [Why NVIDIA GPU?](#why-nvidia-gpu)
2. [Option 1: Cloud Services (Recommended)](#option-1-cloud-services-recommended)
3. [Option 2: Local Windows/Linux PC with NVIDIA GPU](#option-2-local-windowslinux-pc-with-nvidia-gpu)
4. [Option 3: Remote Server/Colab](#option-3-remote-servercolab)
5. [Installation Steps](#installation-steps)
6. [Configuration Changes](#configuration-changes)

---

## Why NVIDIA GPU?

**Benefits:**
- 10-50x faster inference compared to CPU
- Lower temperatures (dedicated cooling)
- Can run larger models (7B, 13B, 70B)
- Better for training custom models (Phase 4)
- Longer sustained performance without throttling

**Mac vs NVIDIA Comparison:**
- Mac M1/M2: Uses Metal Performance Shaders (MPS), limited to 8-16GB unified memory
- NVIDIA RTX 3060: 12GB VRAM, CUDA acceleration, dedicated cooling
- NVIDIA RTX 4090: 24GB VRAM, 16,384 CUDA cores, massive parallel processing

---

## Option 1: Cloud Services (Recommended)

### A. Google Colab Pro ($10/month)
**Specs:** T4 GPU (16GB VRAM), 25GB RAM
**Pros:** Easy setup, Jupyter notebooks, persistent storage
**Cons:** Session limits, need to reconnect

### B. RunPod ($0.30/hour)
**Specs:** RTX 3090/4090 (24GB VRAM)
**Pros:** Pay-per-use, root access, Docker support
**Cons:** Slightly more technical setup

### C. Vast.ai ($0.20-$0.80/hour)
**Specs:** Various GPUs (RTX 3060-4090)
**Pros:** Cheapest option, flexible
**Cons:** Variable availability

### D. Lambda Labs ($0.50/hour)
**Specs:** A100 (40GB VRAM)
**Pros:** Professional grade, fast
**Cons:** More expensive

**RECOMMENDED FOR YOU: RunPod or Vast.ai**
- Cost-effective for development
- Full control over environment
- Can run 24/7 for data collection

---

## Option 2: Local Windows/Linux PC with NVIDIA GPU

### Minimum Requirements:
- NVIDIA GPU: RTX 3060 (12GB) or better
- RAM: 16GB minimum (32GB recommended)
- Storage: 50GB free space
- OS: Windows 10/11 or Ubuntu 20.04+

### Recommended GPUs:
- **Budget:** RTX 3060 12GB ($300-400) - Good for 7B models
- **Mid-range:** RTX 4060 Ti 16GB ($500-600) - Great for 13B models
- **High-end:** RTX 4090 24GB ($1,500+) - Handles 70B models

### Check If You Have NVIDIA GPU:
```bash
# Windows
nvidia-smi

# Linux
lspci | grep -i nvidia
nvidia-smi
```

---

## Option 3: Remote Server/Colab

### Google Colab Setup (FREE - with limits)
1. Go to https://colab.research.google.com/
2. Create new notebook
3. Change runtime to GPU: Runtime → Change runtime type → GPU → Save
4. Upload your code and run

### Colab Pro Features:
- Priority GPU access
- Longer runtimes (24 hours)
- More RAM (32GB)
- Background execution

---

## Installation Steps

### Step 1: Choose Your Platform

#### For Cloud Services (RunPod/Vast.ai):
1. Create account and rent GPU instance
2. Connect via SSH or JupyterLab
3. Follow Linux setup below

#### For Windows PC:
1. Install NVIDIA drivers: https://www.nvidia.com/Download/index.aspx
2. Install CUDA Toolkit 12.1+: https://developer.nvidia.com/cuda-downloads
3. Install Python 3.10 or 3.11 (NOT 3.14 - compatibility issues)

#### For Linux PC:
1. Install NVIDIA drivers
```bash
sudo apt update
sudo apt install nvidia-driver-535
sudo reboot
```

2. Install CUDA Toolkit
```bash
wget https://developer.download.nvidia.com/compute/cuda/12.1.0/local_installers/cuda_12.1.0_530.30.02_linux.run
sudo sh cuda_12.1.0_530.30.02_linux.run
```

### Step 2: Install Python Dependencies

#### Create Virtual Environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Cloud
python3 -m venv venv
source venv/bin/activate
```

#### Install CUDA-enabled packages:
```bash
# Install PyTorch with CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install llama-cpp-python with CUDA
CMAKE_ARGS="-DGGML_CUDA=on" pip install llama-cpp-python --force-reinstall --no-cache-dir

# Install other dependencies
pip install langchain langchain-core langchain-community
pip install redis pinecone-client sentence-transformers
pip install transformers accelerate bitsandbytes
```

### Step 3: Verify GPU Installation

```bash
# Test PyTorch CUDA
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else "None"}')"

# Test NVIDIA GPU
nvidia-smi
```

Expected output:
```
CUDA Available: True
GPU: NVIDIA GeForce RTX 3060
```

### Step 4: Transfer Your Project

#### Option A: Clone from GitHub
```bash
git clone https://github.com/mentneo/new-version-mentlearn.git
cd new-version-mentlearn
```

#### Option B: Upload Files Manually
- Upload all `.py` files
- Upload `Mistral-7B-Instruct-v0.3.Q4_K_M.gguf` model
- Upload configuration files

#### Option C: Download Fresh (Recommended)
```bash
# Download model
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf

# Or use a larger quantization for GPU
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q5_K_M.gguf
```

### Step 5: Install Redis

#### Windows:
```bash
# Download Redis for Windows
# https://github.com/microsoftarchive/redis/releases
# Or use Docker
docker run -d -p 6379:6379 redis
```

#### Linux/Cloud:
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

---

## Configuration Changes

### Create `main_gpu.py` (NVIDIA Version)

I'll create this file with NVIDIA GPU optimizations.

### Key Changes from Mac Version:

1. **GPU Layers:** Increase from 50 to -1 (use all layers)
2. **Device:** Change from 'mps' to 'cuda'
3. **Batch Size:** Increase for faster processing
4. **Context Size:** Can increase to 8192 or higher
5. **Memory Management:** Better VRAM handling

### Performance Comparison:

| Hardware | Tokens/sec | Model Size | Temperature |
|----------|-----------|------------|-------------|
| Mac M1 | 5-10 | 7B Q4 | High (80-90°C) |
| RTX 3060 | 30-50 | 7B Q5 | Low (60-70°C) |
| RTX 4090 | 100-150 | 13B Q5 | Low (55-65°C) |
| A100 | 200-300 | 70B Q4 | Low (50-60°C) |

---

## Troubleshooting

### Issue: CUDA not found
```bash
# Check CUDA installation
nvcc --version

# Add to PATH (Linux)
export PATH=/usr/local/cuda/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH
```

### Issue: Out of VRAM
- Reduce n_gpu_layers
- Use smaller model (Q4 instead of Q5)
- Reduce n_ctx (context size)
- Close other GPU applications

### Issue: Slow performance
- Check GPU usage: `nvidia-smi`
- Ensure CUDA version is correct
- Update GPU drivers
- Increase n_batch

### Issue: Model not found
```bash
# Verify model file
ls -lh *.gguf

# Check path in code
```

---

## Cost Estimation

### Cloud Services (Monthly):

| Service | GPU | Hours/Day | Cost/Month |
|---------|-----|-----------|------------|
| RunPod | RTX 3090 | 8 | $70 |
| RunPod | RTX 4090 | 8 | $120 |
| Vast.ai | RTX 3060 | 8 | $45 |
| Colab Pro | T4 | Unlimited | $10 |

### One-Time Purchase:

| Hardware | Cost | Performance | ROI |
|----------|------|-------------|-----|
| RTX 3060 12GB | $350 | Good | 5 months |
| RTX 4060 Ti 16GB | $550 | Great | 6 months |
| RTX 4090 24GB | $1,600 | Excellent | 13 months |

**RECOMMENDATION:** 
- **Short-term (1-3 months):** Use RunPod or Vast.ai ($50-100/month)
- **Long-term (6+ months):** Buy RTX 3060 or 4060 Ti ($350-550)
- **Development:** Use Colab Pro ($10/month) for testing

---

## Next Steps

1. Choose your platform (cloud or local)
2. Install NVIDIA drivers and CUDA
3. Set up Python environment with GPU support
4. Transfer your project files
5. Run `main_gpu.py` (I'll create this next)
6. Monitor temperature and performance
7. Continue data collection for Phase 1

---

## Quick Start Commands

### For RunPod/Vast.ai (After SSH):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and tools
sudo apt install python3.10 python3.10-venv python3-pip git -y

# Clone project
git clone https://github.com/mentneo/new-version-mentlearn.git
cd new-version-mentlearn

# Setup environment
python3.10 -m venv venv
source venv/bin/activate

# Install CUDA PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install llama-cpp-python with CUDA
CMAKE_ARGS="-DGGML_CUDA=on" pip install llama-cpp-python --force-reinstall --no-cache-dir

# Install dependencies
pip install -r requirements_gpu.txt

# Install Redis
sudo apt install redis-server -y
sudo systemctl start redis

# Download model
wget https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf

# Run!
python main_gpu.py
```

### For Windows PC:
```batch
REM Install Python 3.10 first
python -m venv venv
venv\Scripts\activate

REM Install CUDA PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

REM Install llama-cpp-python with CUDA (Windows)
set CMAKE_ARGS=-DGGML_CUDA=on
pip install llama-cpp-python --force-reinstall --no-cache-dir

REM Install dependencies
pip install -r requirements_gpu.txt

REM Download Redis or use Docker
docker run -d -p 6379:6379 redis

REM Run!
python main_gpu.py
```

---

## Support Resources

- NVIDIA CUDA Toolkit: https://developer.nvidia.com/cuda-toolkit
- llama-cpp-python GPU: https://github.com/abetlen/llama-cpp-python#installation-with-hardware-acceleration
- RunPod Docs: https://docs.runpod.io/
- Vast.ai Guide: https://vast.ai/docs
- Colab GPU Tutorial: https://colab.research.google.com/notebooks/gpu.ipynb

---

**Ready to migrate? Let me know which option you prefer and I'll create the optimized files!**
