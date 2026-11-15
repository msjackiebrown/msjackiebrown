# Project Reorganization Guide

## What Changed?

The Binder project has been restructured to follow Flask best practices and Python project conventions.

### Directory Structure Changes

#### Before
```
binder/
├── flask_app/
│   ├── __init__.py
│   ├── config.py
│   ├── storage.py
│   ├── requirements.txt
│   ├── .env
│   ├── .env.example
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── static/
│   └── templates/
├── run.py
├── ARCHITECTURE.md
├── DEPLOYMENT_CHECKLIST.md
├── FLASK_SETUP.md
├── ... (many other markdown files)
└── docs/ (reference materials scattered)
```

#### After
```
binder/
├── app/                              # Main app package (renamed from flask_app)
│   ├── __init__.py
│   ├── config.py
│   ├── storage.py
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── static/
│   └── templates/
├── tests/                            # NEW: Dedicated test directory
│   ├── __init__.py
│   ├── conftest.py                 # pytest fixtures
│   └── test_app.py                 # Sample tests
├── docs/
│   ├── README.md                   # NEW: Documentation index
│   ├── project/                    # Project-specific docs
│   │   ├── ARCHITECTURE.md
│   │   ├── DEPLOYMENT_CHECKLIST.md
│   │   ├── FLASK_SETUP.md
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── REFACTORING_COMPLETE.md
│   │   └── STORAGE_DESIGN.md
│   └── reference/                  # Reference materials & tutorials
│       ├── RAG Architecture.md
│       ├── Ollama.md
│       └── ... (all research docs)
├── data/                            # Runtime data (git-ignored)
│   ├── chroma/
│   └── uploads/
├── instance/                        # Flask instance files
├── wireframes/                      # UI wireframes and prototypes
├── .env                             # Environment variables (git-ignored)
├── .env.example                     # Environment template
├── .gitignore                       # NEW: Git ignore file
├── README.md                        # NEW: Main readme with setup guide
├── requirements.txt                 # MOVED: Now at project root
├── pyproject.toml                   # NEW: Project metadata
└── run.py                           # Entry point (updated imports)
```

## Key Changes

### 1. **Package Renamed: `flask_app` → `app`**
   - More idiomatic for Flask projects
   - Cleaner import statements

### 2. **Configuration Files Moved to Root**
   - `requirements.txt` now at project root (not inside app/)
   - `.env` and `.env.example` at project root
   - Easier to find and manage dependencies

### 3. **Documentation Reorganized**
   - **Project docs** in `docs/project/` - Architecture, setup, deployment
   - **Reference materials** in `docs/reference/` - Research, tutorials, guides
   - New `docs/README.md` provides navigation index
   - Old redundant docs removed (QUICKSTART, README_FLASK_APP, etc.)

### 4. **New Test Directory**
   - `tests/` for all unit and integration tests
   - `conftest.py` with pytest fixtures
   - Sample `test_app.py` to start from

### 5. **New Configuration Files**
   - **`.gitignore`** - Properly configured for Python and Flask projects
   - **`pyproject.toml`** - Modern Python project metadata (PEP 518/621)
   - **`README.md`** - Comprehensive quick start guide

## What To Do Now

### 1. Update Your IDE/Editor Configuration
If using VS Code, the Flask debugging configuration may need updating:
```json
{
    "configurations": [
        {
            "name": "Python: Flask",
            "type": "python",
            "module": "flask",
            "env": {"FLASK_APP": "run.py"},
            "args": ["run"],
            "jinja": true,
            "justMyCode": true
        }
    ]
}
```

### 2. Update Shell Aliases or Scripts
If you have scripts that reference `flask_app`, update them:
- `from flask_app import ...` → `from app import ...`
- Import paths remain relative in most cases

### 3. Update Imports in Any External Code
If other projects import from binder:
```python
# Old
from flask_app.models import ...
from flask_app.routes import ...

# New
from app.models import ...
from app.routes import ...
```

### 4. Git Considerations
If you have a local git history:
```bash
# The restructuring changed all file paths
# Consider a fresh clone or:
git add .
git commit -m "Restructure project layout to follow best practices"
```

### 5. New Workflow Features

#### Running Tests
```bash
pytest tests/
pytest tests/test_app.py -v
pytest --cov=app  # with coverage
```

#### Building/Packaging
```bash
# Now that we have pyproject.toml:
pip install -e ".[dev]"  # Install in dev mode with dev dependencies
pip install -e ".[test]" # Install with test dependencies
```

## Backward Compatibility

### What Still Works
- `python run.py` still works (same entry point)
- All static files, templates, and data folders work as before
- Environment variables in `.env` work the same way
- Database location is unchanged

### What Needs Updates
- Direct imports: `from flask_app import ...` → `from app import ...`
- Scripts/CI that reference `flask_app/`
- Documentation links (but we've reorganized docs)

## Benefits of This Structure

✅ **Follows Best Practices**
- Standard Flask project structure
- Python packaging conventions (PEP 518/621)

✅ **Better Organization**
- Clear separation of concerns
- Easy to navigate documentation

✅ **Easier Testing**
- Dedicated tests directory
- Pytest fixtures ready to go
- Clear testing conventions

✅ **Better Packaging**
- Ready for PyPI distribution
- Modern Python metadata
- Easy dependency management

✅ **Cleaner Git History**
- Proper .gitignore
- No environment files in git
- Clear separation of source/data/config

## Questions?

Refer to:
- `README.md` - Quick start and feature overview
- `docs/project/ARCHITECTURE.md` - System architecture
- `docs/project/FLASK_SETUP.md` - Flask-specific setup
- `docs/README.md` - Full documentation index
