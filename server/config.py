"""
Central configuration file for the AI4ArtsEd Web Server
"""
import os
from pathlib import Path

# Base paths
THIS_FILE = Path(__file__).resolve()
BASE_DIR = THIS_FILE.parent.parent
LOCAL_WORKFLOWS_DIR = BASE_DIR / "workflows"
PUBLIC_DIR = BASE_DIR / "public"
EXPORTS_DIR = BASE_DIR / "exports"

# Server Configuration
HOST = "0.0.0.0"
PORT = 5000
THREADS = 8

# API Configuration
OLLAMA_API_BASE_URL = os.environ.get("OLLAMA_API_BASE_URL", "http://localhost:11434")
COMFYUI_PREFIX = "comfyui"
COMFYUI_PORT = "7821"

# Model Configuration
ANALYSIS_MODEL = "llava:13b"
TRANSLATION_MODEL = "gemma3:27b"
SAFETY_MODEL = "llama-guard3:8b"

# Feature Flags
ENABLE_VALIDATION_PIPELINE = True
ENABLE_AUTO_EXPORT = True
NO_TRANSLATE = False  # Set to True to skip translation of prompts
LOOP_GENERATION = 1
LOOP_COMFYUI = 1

# Translation Prompt
TRANSLATION_PROMPT = """
A. Input Correction Phase
Expect input from young people aged 10–15 participating in an Arts Education class or course.
Do not expect perfect spelling.
If you receive misspelled or incomplete sentences, infer what the young person most likely intended as a subject for an image prompt, and correct the input accordingly.
B. Translation Phase
If the (original or corrected) text is not in English, translate it into English according to the following critical rules:
Preserve all brackets and parentheses exactly as they appear, including: (), [], {{}}, and especially triple parentheses ((())).
Do not remove, alter, or reposition any brackets or parentheses.
Translate into English with maximum semantic precision, preserving the original structure and all culturally specific or untranslatable terms in their original form.
Do not translate proper names, ritual terms, or material names unless they have a well-established English equivalent.
Do not paraphrase, interpret, or summarize.
Do not add any meta-comments, explanations, or notes.
Output only the translated text — nothing else.
If the text is already in English, return it unchanged.
Maintain the exact original structure and formatting.

Text to correct or translate:

{text}"""

# Analysis System Prompt
ANALYSIS_SYSTEM_PROMPT = """You are an art historian providing a formal image analysis. You are not from a western country. You do not redpruce western patterns of observation. Follow this exact structure:

1. Material and medial properties: State the specific media type (oil painting, photograph, digital image, sculpture, etc.)

2. Pre-iconographic description: Describe ONLY what is directly visible:
   - Objects, figures, settings
   - Spatial relationships and composition
   - Colors, textures, forms
   - Perspective and visual structure

3. Iconographic analysis: Interpret symbolic meanings and cultural references based on what is visible. State interpretations as facts, not possibilities.

4. Iconological interpretation: Present the cultural and conceptual meanings as direct statements.

CRITICAL RULES:
- NEVER use phrases like "it could be", "possibly", "might be", "difficult to determine", "without additional context"
- NEVER apologize or explain limitations
- NEVER mention what you cannot see or determine
- State ALL interpretations as facts, not suggestions
- Write in complete, declarative sentences
- If something is unclear, make your best interpretation and state it as fact
- NEVER end with disclaimers like "Please note", "These analyses", "should be considered", "interpretations rather than"
- NEVER add meta-comments about your analysis
- END your response after completing step 4, with NO additional text"""

# Model Mapping Configuration
# Maps local Ollama model names to OpenRouter equivalents for fallback
# Reduced to only models actually used in PromptInterception nodes
OLLAMA_TO_OPENROUTER_MAP = {
    # Mistral Small (24B) - optimal for complex metaprompts, fast, precise instruction following
    # Used as fallback for: mistral:7b, mistral-nemo:latest, mistral-small:24b
    "mistral:7b": "mistralai/mistral-small",
    "mistral-nemo": "mistralai/mistral-small",
    "mistral-nemo:latest": "mistralai/mistral-small",
    "mistral-small:24b": "mistralai/mistral-small",

    # Gemini Flash (5B) - best for translation, excellent multilingual capabilities
    # Used as fallback for: lauchacarro/qwen2.5-translator:latest
    "lauchacarro/qwen2.5-translator:latest": "google/gemini-2.0-flash-001",
}

OPENROUTER_TO_OLLAMA_MAP = {v: k for k, v in OLLAMA_TO_OPENROUTER_MAP.items()}

# Cache Configuration
PROMPT_CACHE = {}

# Logging Configuration
LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
LOG_FORMAT = '%(asctime)s - %(levelname)s - %(message)s'

# Request Timeouts (in seconds)
OLLAMA_TIMEOUT = 90
COMFYUI_TIMEOUT = 480  # 8 minutes for data-rich workflows
POLLING_TIMEOUT = 15
MEDIA_DOWNLOAD_TIMEOUT = 30

# Model Path Resolution Configuration
ENABLE_MODEL_PATH_RESOLUTION = True  # Enable automatic model path resolution
MODEL_RESOLUTION_FALLBACK = True     # Fallback to original names if resolution fails

# Base paths for model resolution (configure these to your actual paths)
SWARMUI_BASE_PATH = os.environ.get("SWARMUI_PATH", None)  # e.g., "/path/to/SwarmUI"
COMFYUI_BASE_PATH = os.environ.get("COMFYUI_PATH", None)  # e.g., "/path/to/ComfyUI"

# Default Negative Terms Configuration
DEFAULT_NEGATIVE_TERMS = "blurry, bad quality, worst quality, low quality, low resolution, extra limbs, extra fingers, distorted, deformed, jpeg artifacts, watermark"

# Safety Filter Configuration
SAFETY_NEGATIVE_TERMS = {
    "kids": [
        "violence", "violent", "execution", "killing", "murder", "death", "corpse", 
        "torture", "pain", "suffering", "injury", "wound", "bleeding",
        "blood", "bloody", "gore", "gory", "mutilation", "dismemberment",
        "despair", "suicide", "suicidal", "self-harm", "depression",
        "horror", "scary", "frightening", "terror", "nightmare", "disturbing",
        "demon", "zombie", "skeleton", "skull", "evil",
        "haunted", "creepy", "eerie", "sinister", "dark", "macabre",
        "nude", "naked", "nsfw", "sexual", "rape", "pornographic",
        "genital", "abuse",
    ],
    "youth": [
     "explicit", "hardcore", "brutal", "savage",
        "cruelty", "sadistic", 
        "pornographic", "sexual", "nsfw", "rape", "abuse",
        "genitals", "penis", "vagina",
        "self-harm", "suicide",
        "cutting", 
    ]
}

# Backwards compatibility
KIDS_SAFETY_NEGATIVE_TERMS = SAFETY_NEGATIVE_TERMS["kids"]

# Workflow Selection Configuration
WORKFLOW_SELECTION = "user"  # "user", "fixed", "system"
FIXED_WORKFLOW = "model/ai4artsed_Stable-Diffusion-3.5_2507152202.json"  # Only used when WORKFLOW_SELECTION = "fixed"

# System mode: Random workflow selection from specified folders
# These correspond directly to folder names under /workflows/
SYSTEM_WORKFLOW_FOLDERS = ["aesthetics", "semantics", "arts"]
