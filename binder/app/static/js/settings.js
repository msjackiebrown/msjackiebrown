// ============================================================
// BINDER — Settings Page JavaScript (Flask Version)
// ============================================================

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
});

// Attach event listeners
function attachEventListeners() {
    // Save button
    document.getElementById('save-btn').addEventListener('click', saveSettings);
    
    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        if (confirm('Discard changes?')) {
            window.history.back();
        }
    });
}

// Save settings
function saveSettings() {
    const updatedSettings = {
        models: {
            llm_primary: document.getElementById('llm-primary').value,
            llm_quality: document.getElementById('llm-quality').value,
            embedding_model: document.getElementById('embedding-model').value
        },
        retrieval: {
            top_k: parseInt(document.getElementById('top-k').value),
            chunk_size: parseInt(document.getElementById('chunk-size').value),
            chunk_overlap: parseInt(document.getElementById('chunk-overlap').value)
        },
        servers: {
            ollama_url: document.getElementById('ollama-url').value,
            bind_address: document.getElementById('bind-address').value
        }
    };
    
    // Validate
    if (!validateSettings(updatedSettings)) {
        return;
    }
    
    // Send to backend
    fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings)
    })
    .then(res => res.json())
    .then(data => {
        showToast('✓ Settings saved', 'success');
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    })
    .catch(err => {
        console.error('Error saving settings:', err);
        showToast('Error saving settings', 'error');
    });
}

// Validate settings
function validateSettings(settings) {
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

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.classList.remove('success', 'error', 'info');
    toast.classList.add(type);
    toast.querySelector('.toast-body').textContent = message;
    
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
}
