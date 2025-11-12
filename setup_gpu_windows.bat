@echo off
REM Mindneox.ai - NVIDIA GPU Setup Script for Windows
REM Run this on your Windows PC with NVIDIA GPU

echo ============================================================
echo 🚀 Mindneox.ai - NVIDIA GPU Setup for Windows
echo ============================================================

REM Check for NVIDIA GPU
echo.
echo 🔍 Checking for NVIDIA GPU...
where nvidia-smi >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ nvidia-smi not found!
    echo 💡 Install NVIDIA drivers first:
    echo    https://www.nvidia.com/Download/index.aspx
    pause
    exit /b 1
)

echo ✅ NVIDIA GPU detected:
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

REM Check Python
echo.
echo 🔍 Checking Python installation...
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found!
    echo 💡 Install Python 3.10 or 3.11:
    echo    https://www.python.org/downloads/
    pause
    exit /b 1
)

python --version
echo ✅ Python found

REM Check CUDA (optional)
echo.
echo 🔍 Checking CUDA installation...
where nvcc >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  CUDA toolkit not found
    echo 💡 Install CUDA 12.1 for best performance:
    echo    https://developer.nvidia.com/cuda-downloads
    echo.
    set /p continue="Continue without CUDA? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
) else (
    nvcc --version
    echo ✅ CUDA toolkit found
)

REM Create project directory
echo.
echo 📁 Creating project directory...
set PROJECT_DIR=%USERPROFILE%\mindneox-gpu
if exist "%PROJECT_DIR%" (
    echo ⚠️  Directory %PROJECT_DIR% already exists
    set /p remove="Remove and recreate? (y/n): "
    if /i "%remove%"=="y" (
        rmdir /s /q "%PROJECT_DIR%"
    )
)

mkdir "%PROJECT_DIR%" 2>nul
cd /d "%PROJECT_DIR%"
echo ✅ Working directory: %PROJECT_DIR%

REM Create virtual environment
echo.
echo 🐍 Creating Python virtual environment...
python -m venv venv
call venv\Scripts\activate.bat
echo ✅ Virtual environment activated

REM Upgrade pip
echo.
echo 📦 Upgrading pip...
python -m pip install --upgrade pip setuptools wheel

REM Install PyTorch with CUDA
echo.
echo 🔥 Installing PyTorch with CUDA support...
echo ⚠️  This may take a few minutes...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
echo ✅ PyTorch installed

REM Verify PyTorch CUDA
echo.
echo 🔍 Verifying PyTorch CUDA...
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else \"None\"}')"

REM Install llama-cpp-python with CUDA
echo.
echo 🦙 Installing llama-cpp-python with CUDA support...
echo ⚠️  This may take 5-10 minutes...
set CMAKE_ARGS=-DGGML_CUDA=on
pip install llama-cpp-python --force-reinstall --no-cache-dir --verbose
echo ✅ llama-cpp-python with CUDA installed

REM Install other dependencies
echo.
echo 📦 Installing other dependencies...
(
echo langchain^>=0.1.0
echo langchain-core^>=0.1.0
echo langchain-community^>=0.0.10
echo redis^>=5.0.0
echo pinecone-client^>=5.0.0
echo sentence-transformers^>=2.2.0
echo transformers^>=4.30.0
echo accelerate^>=0.20.0
echo scikit-learn^>=1.3.0
echo numpy^>=1.24.0
echo nvidia-ml-py3^>=7.352.0
echo gpustat^>=1.0.0
echo psutil^>=5.9.0
) > requirements_minimal.txt

pip install -r requirements_minimal.txt
echo ✅ All dependencies installed

REM Check Redis
echo.
echo 💾 Checking Redis...
where redis-server >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Redis not found
    echo 💡 Option 1: Use Docker
    echo    docker run -d -p 6379:6379 redis
    echo 💡 Option 2: Install Redis for Windows
    echo    https://github.com/microsoftarchive/redis/releases
    echo.
    echo You can continue without Redis, but caching won't work optimally
    pause
) else (
    echo ✅ Redis found
)

REM Download model
echo.
echo 📥 Downloading Mistral-7B model...
if not exist "Mistral-7B-Instruct-v0.3.Q4_K_M.gguf" (
    echo Downloading from Hugging Face...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.3-GGUF/resolve/main/Mistral-7B-Instruct-v0.3.Q4_K_M.gguf' -OutFile 'Mistral-7B-Instruct-v0.3.Q4_K_M.gguf'}"
    echo ✅ Model downloaded
) else (
    echo ✅ Model already exists
)

REM Create test script
echo.
echo 📝 Creating GPU test script...
(
echo import torch
echo.
echo print^("=" * 60^)
echo print^("🔍 GPU Test Results"^)
echo print^("=" * 60^)
echo.
echo print^(f"\nCUDA Available: {torch.cuda.is_available^(^)}"^)
echo.
echo if torch.cuda.is_available^(^):
echo     print^(f"GPU Name: {torch.cuda.get_device_name^(0^)}"^)
echo     print^(f"GPU Count: {torch.cuda.device_count^(^)}"^)
echo     print^(f"CUDA Version: {torch.version.cuda}"^)
echo     print^(f"PyTorch Version: {torch.__version__}"^)
echo     
echo     total_memory = torch.cuda.get_device_properties^(0^).total_memory / 1024**3
echo     print^(f"Total VRAM: {total_memory:.2f} GB"^)
echo     
echo     print^("\n🔥 Testing CUDA operations..."^)
echo     x = torch.randn^(1000, 1000^).cuda^(^)
echo     y = torch.randn^(1000, 1000^).cuda^(^)
echo     z = torch.matmul^(x, y^)
echo     print^("✅ CUDA operations working!"^)
echo     
echo     print^("\n🦙 Testing llama-cpp-python..."^)
echo     try:
echo         from llama_cpp import Llama
echo         print^("✅ llama-cpp-python imported successfully"^)
echo     except Exception as e:
echo         print^(f"❌ Error: {e}"^)
echo else:
echo     print^("❌ CUDA not available!"^)
echo     print^("💡 Check NVIDIA drivers and CUDA installation"^)
echo.
echo print^("\n" + "=" * 60^)
) > test_gpu.py

REM Run test
echo.
echo 🧪 Running GPU test...
python test_gpu.py

REM Create convenience batch files
echo.
echo 📝 Creating convenience scripts...

(
echo @echo off
echo call venv\Scripts\activate.bat
echo python main_gpu.py %%*
) > run_gpu.bat

(
echo @echo off
echo call venv\Scripts\activate.bat
echo python main_gpu.py --benchmark
) > run_benchmark.bat

(
echo @echo off
echo nvidia-smi
echo timeout /t 1 ^>nul
echo goto :loop
) > monitor_gpu.bat

REM Final instructions
echo.
echo ============================================================
echo ✅ SETUP COMPLETE!
echo ============================================================
echo.
echo 📍 Project directory: %PROJECT_DIR%
echo.
echo 🚀 Quick Start:
echo    cd %PROJECT_DIR%
echo    run_gpu.bat
echo.
echo 📊 Run benchmark:
echo    run_benchmark.bat
echo.
echo 📈 Monitor GPU:
echo    monitor_gpu.bat
echo    # or: nvidia-smi
echo.
echo 📁 Files created:
echo    • venv\ - Python virtual environment
echo    • Mistral-7B-Instruct-v0.3.Q4_K_M.gguf - Model file
echo    • test_gpu.py - GPU test script
echo    • run_gpu.bat - Run script
echo    • run_benchmark.bat - Benchmark script
echo    • monitor_gpu.bat - GPU monitor
echo.
echo 💡 Next steps:
echo    1. Copy main_gpu.py to %PROJECT_DIR%
echo    2. Run: run_gpu.bat
echo.
echo 🔗 For more info, see NVIDIA_GPU_SETUP.md
echo ============================================================
echo.
pause
