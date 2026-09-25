import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "SOVA Workbench"
    VERSION: str = "1.0.0"
    AIR_GAPPED_MODE: bool = True
    ENVIRONMENT: str = "on-premise-production"
    
    # Security & Auth
    SECRET_KEY: str = "sovereign-ai-workbench-super-secret-enterprise-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12  # 12 hours shift token
    
    # Database (Defaults to local SQLite for instant zero-dependency execution, or Postgres)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite+aiosqlite:///{BASE_DIR}/sovereign.db")
    
    # Storage Paths
    STORAGE_DIR: Path = BASE_DIR / "storage"
    UPLOAD_DIR: Path = BASE_DIR / "storage" / "uploads"
    GENERATED_DIR: Path = BASE_DIR / "storage" / "generated"
    DEMO_DATA_DIR: Path = BASE_DIR / "demo_data"
    
    # Local Open-Weight Model Serving (Ollama / vLLM local endpoints)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    VLLM_BASE_URL: str = os.getenv("VLLM_BASE_URL", "http://127.0.0.1:8000/v1")
    DEFAULT_VISION_MODEL: str = "qwen2.5-vl:7b"
    DEFAULT_CODE_MODEL: str = "qwen2.5-coder:7b"
    DEFAULT_REASONING_MODEL: str = "deepseek-r1:7b"
    DEFAULT_FAST_MODEL: str = "llama3.2:3b"

    # ── Model Concurrency Strategy (Gap 1.1 fix) ──────────────────────────────
    # PS SIH26117 requires multiple open-weight models with auto-routing.
    # Strategy: SEQUENTIAL HOT-SWAP (single active model at a time via Ollama).
    #
    # Rationale:
    #   • 4-bit quantized 7B models (GGUF Q4_K_M) use ~4.5–5.5 GB VRAM each.
    #   • A mid-range GPU (RTX 3090 / 24 GB) can hold 2 models simultaneously;
    #     a single A100 (40 GB) can hold all 4.
    #   • For demo environments (single GPU ≤16 GB): Ollama's keep_alive=30s
    #     evicts the previous model before loading the next, enabling fast hot-swap
    #     with <10s swap time between tasks.
    #   • The router logically represents a multi-model registry and routes tasks
    #     to the correct model; sequential loading is the physical concurrency mode.
    #   • Future: GGUF Q4_K_M variants of all 4 models sized to coexist in 24 GB.
    #
    # Model Licenses (deployment safety):
    #   • qwen2.5-vl:7b         — Apache 2.0 ✅ (commercial/PSU safe)
    #   • qwen2.5-coder:7b      — Apache 2.0 ✅ (commercial/PSU safe)
    #   • deepseek-r1:7b        — MIT ✅ (commercial/PSU safe)
    #   • llama3.2:3b           — Llama 3 Community License ⚠️
    #                             (free for internal PSU use; attribution required;
    #                              Meta review required if MAU > 700M — not applicable)
    #
    # Pre-air-gap model weight download (Gap 3.b):
    #   Model weights are downloaded ONCE before network isolation:
    #     ollama pull qwen2.5-vl:7b && ollama pull qwen2.5-coder:7b
    #     ollama pull deepseek-r1:7b && ollama pull llama3.2:3b
    #   After pull, Ollama runs fully offline. The network interface can then
    #   be physically disabled (unplugged / Wi-Fi off) for air-gap enforcement.
    OLLAMA_KEEP_ALIVE_SECONDS: int = 30   # Evict model after 30s idle for swap
    
    # Code Sandbox
    SANDBOX_TIMEOUT_SECONDS: int = 30
    SANDBOX_MEMORY_LIMIT_MB: int = 512
    SANDBOX_MAX_OUTPUT_CHARS: int = 10000
    
    # CORS (Strictly Local Origin for Air-Gap)
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="allow")

settings = Settings()

# Ensure directories exist
settings.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.GENERATED_DIR.mkdir(parents=True, exist_ok=True)
