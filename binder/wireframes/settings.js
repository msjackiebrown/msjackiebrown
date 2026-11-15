// ============================================================
// BINDER — Settings Page JavaScript
// ============================================================

// Settings data
let settings = {
    models: {
        llm_primary: 'qwen3:14b',
        llm_quality: 'qwen3.5:27b',
        embedding_model: 'qwen3-embedding:0.6b'
    },
    retrieval: {
        top_k: 5,
        chunk_size: 1000,
        chunk_overlap: 200
    },
    servers: {
        ollama_url: 'http://ai-lab:11434',
        sqlite_path: './data/binder.db',
        chromadb_path: './data/chroma',
        bind_address: '127.0.0.1',
        lan_mode: false
    }
};

const defaultSettings = JSON.parse(JSON.stringify(settings));

// Available models from Ollama
const availableModels = [
    { name: 'qwen3:14b', size: '9GB' },
    { name: 'qwen3.5:27b', size: '16GB' },
    { name: 'qwen3-embedding:0.6b', size: '400MB' },
    { name: 'qwen3:8b', size: '5GB' },
    { name: 'mistral:latest', size: '4GB' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    attachEventListeners();
    checkOllamaStatus();
});

// Load settings into form
function loadSettings() {
    // Models section
    document.getElementById('llm-primary').value = settings.models.llm_primary;
    document.getElementById('llm-quality').value = settings.models.llm_quality;
    document.getElementById('embedding-model').value = settings.models.embedding_model;

    // Retrieval section
    document.getElementById('top-k').value = settings.retrieval.top_k;
    document.getElementById('chunk-size').value = settings.retrieval.chunk_size;
    document.getElementById('chunk-overlap').value = settings.retrieval.chunk_overlap;

    // Servers section
    document.getElementById('ollama-url').value = settings.servers.ollama_url;
    document.getElementById('sqlite-path').value = settings.servers.sqlite_path;
    document.getElementById('chromadb-path').value = settings.servers.chromadb_path;
    document.getElementById('bind-address').value = settings.servers.bind_address;
    document.getElementById('lan-mode').checked = settings.servers.lan_mode;

    // Update bind address when LAN mode changes
    document.getElementById('lan-mode').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('bind-address').value = '0.0.0.0';
        } else {
            document.getElementById('bind-address').value = '127.0.0.1';
        }
    });

    displayAvailableModels();
}

// Display available models from Ollama
function displayAvailableModels() {
    const modelsList = document.getElementById('models-list');
    modelsList.innerHTML = '';

    availableModels.forEach(model => {
        const item = document.createElement('div');
        item.className = 'model-item';
        item.innerHTML = `<strong>${model.name}</strong> <span class="text-muted">${model.size}</span>`;
        modelsList.appendChild(item);
    });
}

// Attach event listeners
function attachEventListeners() {
    // Reset buttons
    document.getElementById('reset-models').addEventListener('click', () => {
        resetSection('models');
    });

    document.getElementById('reset-retrieval').addEventListener('click', () => {
        resetSection('retrieval');
    });

    document.getElementById('reset-servers').addEventListener('click', () => {
        resetSection('servers');
    });

    // Ollama check button
    document.getElementById('ollama-check-btn').addEventListener('click', () => {
        checkOllamaStatus();
    });

    // Open log button
    document.getElementById('open-log-btn').addEventListener('click', () => {
        showToast('Opening trace log...', 'info');
    });

    // Save button
    document.getElementById('save-btn').addEventListener('click', saveSettings);

    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        if (confirm('Discard changes?')) {
            window.history.back();
        }
    });

    // LAN mode warning
    document.getElementById('lan-mode').addEventListener('change', (e) => {
        if (e.target.checked) {
            showToast('⚠ Security warning: LAN access enabled', 'warning');
        }
    });
}

// Reset a settings section
function resetSection(section) {
    if (!confirm(`Reset ${section} to defaults?`)) {
        return;
    }

    if (section === 'models') {
        settings.models = JSON.parse(JSON.stringify(defaultSettings.models));
        document.getElementById('llm-primary').value = settings.models.llm_primary;
        document.getElementById('llm-quality').value = settings.models.llm_quality;
        document.getElementById('embedding-model').value = settings.models.embedding_model;
    } else if (section === 'retrieval') {
        settings.retrieval = JSON.parse(JSON.stringify(defaultSettings.retrieval));
        document.getElementById('top-k').value = settings.retrieval.top_k;
        document.getElementById('chunk-size').value = settings.retrieval.chunk_size;
        document.getElementById('chunk-overlap').value = settings.retrieval.chunk_overlap;
    } else if (section === 'servers') {
        settings.servers = JSON.parse(JSON.stringify(defaultSettings.servers));
        document.getElementById('ollama-url').value = settings.servers.ollama_url;
        document.getElementById('sqlite-path').value = settings.servers.sqlite_path;
        document.getElementById('chromadb-path').value = settings.servers.chromadb_path;
        document.getElementById('bind-address').value = settings.servers.bind_address;
        document.getElementById('lan-mode').checked = settings.servers.lan_mode;
    }

    showToast(`✓ ${section} reset to defaults`, 'success');
}

// Save settings
function saveSettings() {
    // Collect form values
    settings.models.llm_primary = document.getElementById('llm-primary').value;
    settings.models.llm_quality = document.getElementById('llm-quality').value;
    settings.models.embedding_model = document.getElementById('embedding-model').value;

    settings.retrieval.top_k = parseInt(document.getElementById('top-k').value);
    settings.retrieval.chunk_size = parseInt(document.getElementById('chunk-size').value);
    settings.retrieval.chunk_overlap = parseInt(document.getElementById('chunk-overlap').value);

    settings.servers.ollama_url = document.getElementById('ollama-url').value;
    settings.servers.sqlite_path = document.getElementById('sqlite-path').value;
    settings.servers.chromadb_path = document.getElementById('chromadb-path').value;
    settings.servers.bind_address = document.getElementById('bind-address').value;
    settings.servers.lan_mode = document.getElementById('lan-mode').checked;

    // Validate
    if (!validateSettings()) {
        return;
    }

    // Check if embedding model changed
    if (settings.models.embedding_model !== defaultSettings.models.embedding_model) {
        if (!confirm('⚠ Changing the embedding model orphans all existing collections. All binders must be re-ingested after saving. Continue?')) {
            return;
        }
    }

    // Save to backend
    console.log('Saving settings:', settings);
    showToast('✓ Settings saved', 'success');

    // In a real app, send to /api/settings
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Validate settings
function validateSettings() {
    // Top K range
    if (settings.retrieval.top_k < 3 || settings.retrieval.top_k > 10) {
        showToast('Top K must be between 3 and 10', 'error');
        return false;
    }

    // Chunk size > 0
    if (settings.retrieval.chunk_size <= 0) {
        showToast('Chunk size must be greater than 0', 'error');
        return false;
    }

    // Chunk overlap < chunk size
    if (settings.retrieval.chunk_overlap >= settings.retrieval.chunk_size) {
        showToast('Chunk overlap must be less than chunk size', 'error');
        return false;
    }

    return true;
}

// Check Ollama status
function checkOllamaStatus() {
    const statusDiv = document.getElementById('ollama-status');
    statusDiv.innerHTML = '<span id="ollama-status-text">Checking…</span><button class="btn btn-sm btn-outline-info ms-2" id="ollama-check-btn">Check</button>';

    // Simulate API call
    setTimeout(() => {
        const isOnline = Math.random() > 0.3;

        if (isOnline) {
            statusDiv.innerHTML = `
                <div class="alert alert-success mb-0">
                    ✓ Ollama is online and responding
                    <button class="btn btn-sm btn-outline-success ms-2" id="ollama-check-btn">Check</button>
                </div>
            `;
        } else {
            statusDiv.innerHTML = `
                <div class="alert alert-danger mb-0">
                    ✗ Ollama is unreachable at ${settings.servers.ollama_url}
                    <button class="btn btn-sm btn-outline-danger ms-2" id="ollama-check-btn">Check</button>
                </div>
            `;
        }

        // Re-attach listener
        document.getElementById('ollama-check-btn').addEventListener('click', () => {
            checkOllamaStatus();
        });
    }, 500);
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.classList.remove('success', 'error', 'info', 'warning');
    toast.classList.add(type);
    toast.querySelector('.toast-body').textContent = message;

    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
}
