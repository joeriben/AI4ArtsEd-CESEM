AI4ArtsEd-CESEM: A Software Framework for Critical Educational and Scientific Exploration and Manipulation of Generative AI

**Production-Stable Flask Server** for the AI4ArtsEd pedagogical platform.

> **Migration Notice**: Will remain in use until new schema-based DevServer is stable.

## 🔄 Repository Status

- **This Repository (Legacy)**: Production Flask server (maintenance mode)

Use this server if you need:

✅ **Stable production environment** - Battle-tested, proven implementation
✅ **Original ComfyUI Custom Node** - `ai4artsed_prompt_interception` integration
✅ **ComfyUI API workflow compatibility** - All original workflows work out-of-box
✅ **SSE-based execution** - Server-Sent Events for real-time updates
✅ **Proven architecture** - Used in live workshops and educational settings

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Ollama (for local LLM) - `ollama serve`
- ComfyUI with `ai4artsed_prompt_interception` Custom Node
- https://github.com/joeriben/ai4artsed_comfyui_nodes
- SwarmUI (optional, for enhanced ComfyUI on port 7821)

### Installation

```bash
# Clone repository
git clone https://github.com/joeriben/ai4artsed_webserver_legacy.git
cd ai4artsed_webserver_legacy

# Install dependencies
pip install -r requirements.txt

# Start server
bash start_webserver.sh
```

Server runs on `http://localhost:5000`

### Configuration

Edit `server/config.py` to configure:
- Ollama connection (default: localhost:11434)
- ComfyUI connection (default: localhost:7821 for SwarmUI)
- Workflow directory paths
- Export settings

## 📁 Project Structure

```
ai4artsed_webserver_legacy/
├── server/                      # Flask server
│   ├── server.py                # Entry point
│   ├── config.py                # Configuration
│   └── my_app/
│       ├── routes/              # API endpoints
│       │   ├── workflow_routes.py         # Main execution
│       │   ├── sse_routes.py              # Real-time updates
│       │   └── export_routes.py           # Media export
│       ├── services/            # Business logic
│       │   ├── ollama_service.py          # LLM translation
│       │   ├── comfyui_service.py         # Media generation
│       │   └── workflow_logic_service.py  # Workflow handling
│       └── utils/               # Helper functions
├── public/                      # Frontend
│   ├── index.html               # Main interface
│   ├── js/                      # JavaScript modules
│   │   ├── workflow-streaming.js          # Execution handler
│   │   ├── simple-translation.js          # Direct translation
│   │   └── sse-connection.js              # Server events
│   └── css/                     # Styles
├── workflows/                   # ComfyUI workflow JSON files
│   ├── arts_and_heritage/       # Cultural transformations
│   ├── aesthetics/              # Visual style filters
│   ├── semantics/               # Language transformations
│   ├── sound/                   # Music generation
│   └── ...
├── exports/                     # Generated media output
├── fyi_comfyui-customnodes_ai4artsed_comfyui/  # Custom Node
└── start_webserver.sh           # Start script
```

## 🎯 Key Features

### Pedagogical Prompt Interception

The core feature: Transform user prompts through educational and artistic lenses before media generation.

**Example Workflows:**
- **Bauhaus** - Functionalist geometric reduction
- **Dada** - Absurdist transformation
- **Renaissance** - Classical artistic style
- **Jugendsprache** - Youth language translation
- **Stillepost** - Iterative transformation (telephone game)

### ComfyUI Integration

Uses the `ai4artsed_prompt_interception` Custom Node to inject LLM-transformed prompts into ComfyUI workflows:

```json
{
  "class_type": "ai4artsed_prompt_interception",
  "inputs": {
    "meta_prompt": "Transform into Bauhaus style...",
    "user_text": "{{USER_PROMPT}}",
    "model_name": "mistral-nemo",
    "ollama_url": "http://localhost:11434"
  }
}
```

### Real-Time Execution

Server-Sent Events (SSE) provide live updates:
- Progress notifications
- Media generation status
- Error handling
- Export links

## 🔑 API Endpoints

### Main Execution

**POST** `/run_workflow`
```json
{
  "workflow_name": "dada",
  "user_text": "A beautiful sunset"
}
```

### Direct Translation

**POST** `/validate-prompt`
```json
{
  "prompt": "Test prompt",
  "workflow": "bauhaus"
}
```

### Server-Sent Events

**GET** `/sse/execute/{workflow_name}`
- Real-time execution updates
- Progress tracking
- Media URLs when ready

## 🔄 Migration to DevServer

If you're interested in the next-generation architecture, see the main repository:

**[ai4artsed_webserver (DevServer)](https://github.com/joeriben/ai4artsed_webserver)**

DevServer features:
- ✨ 3-Layer Pipeline Architecture (Chunks → Pipelines → Configs)
- ✨ Backend-agnostic design (swap ComfyUI for other backends)
- ✨ 4-Stage Pre-Interception System (translation, safety, refinement)
- ✨ Task-based model selection
- ✨ JSON-based config system (no code changes for new workflows)

**Migration Path:**
1. Test workflows in Legacy Server (this repo)
2. Extract `meta_prompt` from workflow JSON
3. Create DevServer config with `context` field
4. Reference original workflow in `legacy_source` field

## 🛠️ Maintenance & Support

### Status: Maintenance Mode

- ✅ **Bug fixes** - Critical issues will be addressed
- ✅ **Security updates** - Dependencies will be maintained
- ✅ **Documentation** - Existing docs will be preserved
- ❌ **New features** - Developed in DevServer only
- ❌ **Architecture changes** - Stability is the priority

### Known Issues

- ComfyUI Custom Node required (not standalone)
- SSE connections may timeout on slow networks
- Limited to single workflow execution at a time
- Frontend tightly coupled to ComfyUI API

### Support

For issues with:
- **Legacy Server**: Open issue in this repository
- **DevServer**: Open issue in [main repository](https://github.com/joeriben/ai4artsed_webserver)
- **Custom Node**: See `fyi_comfyui-customnodes_ai4artsed_comfyui/` directory

## 📚 Documentation

- **Workflow Guide**: `workflows/README.md` - How to create and modify workflows
- **API Documentation**: See endpoint docstrings in `server/my_app/routes/`
- **Custom Node**: `fyi_comfyui-customnodes_ai4artsed_comfyui/README.md`

## 🤝 Contributing

### Bug Fixes Welcome

For bug fixes and security patches:
1. Fork this repository
2. Create a bugfix branch
3. Test thoroughly with production workflows
4. Submit pull request with clear description

### New Features → DevServer

For new features and improvements, contribute to:
**[ai4artsed_webserver (DevServer)](https://github.com/joeriben/ai4artsed_webserver)**

Read [`devserver/docs/README_FIRST.md`](https://github.com/joeriben/ai4artsed_webserver/blob/main/devserver/docs/README_FIRST.md) before contributing.

## 📄 License

[Add your license information here]

## 🔗 Related Resources

- **DevServer (Main Repo)**: https://github.com/joeriben/ai4artsed_webserver
- **ComfyUI**: https://github.com/comfyanonymous/ComfyUI
- **SwarmUI**: https://github.com/mcmonkeyprojects/SwarmUI
- **Ollama**: https://ollama.ai

---

**Repository Created**: 2025-10-30
**Status**: Maintenance Mode (Stable Production)
**Last Updated**: 2025-10-30
**Production-Ready**: ✅ Yes
