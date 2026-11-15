// ============================================================
// BINDER — Home Page JavaScript (Flask Version)
// Listview Version
// ============================================================

let currentBinderId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    checkOllamaStatus();
    loadBinders();
});

// Load binders from API
function loadBinders() {
    fetch('/api/binders')
        .then(res => res.json())
        .then(binders => {
            renderListView(binders);
        })
        .catch(err => {
            console.error('Error loading binders:', err);
            showToast('Error loading binders', 'error');
        });
}

// Render listview
function renderListView(binders) {
    const listItems = document.getElementById('binders-list');
    const emptyState = document.getElementById('empty-state');
    const listview = document.getElementById('binders-listview');
    const footer = document.getElementById('binders-footer');
    
    listItems.innerHTML = '';
    
    if (binders.length === 0) {
        emptyState.classList.remove('d-none');
        listview.classList.add('d-none');
        footer.classList.add('d-none');
        document.getElementById('count').textContent = '0';
        return;
    }
    
    emptyState.classList.add('d-none');
    listview.classList.remove('d-none');
    footer.classList.remove('d-none');
    
    binders.forEach(binder => {
        const item = createListItem(binder);
        listItems.appendChild(item);
    });
    
    // Update count
    document.getElementById('count').textContent = binders.length;
}

// Create a single list item
function createListItem(binder) {
    const item = document.createElement('div');
    item.className = `list-item status-${binder.status}`;
    item.dataset.binderId = binder.id;
    
    const createdDate = binder.created_at ? new Date(binder.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }) : '—';
    
    const modifiedDate = binder.updated_at ? new Date(binder.updated_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }) : '—';
    
    item.innerHTML = `
        <div class="col-name">
            <span class="status-indicator"></span>
            <span class="binder-name" title="${binder.title}">${escapeHtml(binder.title)}</span>
        </div>
        <div class="col-description">
            <span class="binder-desc" title="${binder.description || ''}">${escapeHtml(binder.description || '—')}</span>
        </div>
        <div class="col-sources">
            <span class="source-badge">📄 ${binder.source_count || 0}</span>
        </div>
        <div class="col-dates">
            <span class="binder-created">${createdDate}</span>
        </div>
        <div class="col-modified">
            <span class="binder-modified">${modifiedDate}</span>
        </div>
        <div class="col-actions">
            <button class="btn-action btn-open" title="Open" data-action="open">📖</button>
            <button class="btn-action btn-rename" title="Rename" data-action="rename">✏</button>
            <button class="btn-action btn-delete text-danger" title="Delete" data-action="delete">🗑</button>
        </div>
    `;
    
    // Event listeners
    item.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-action')) {
            openBinder(binder.id);
        }
    });
    
    // Action buttons
    const actionBtns = item.querySelectorAll('.btn-action');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.dataset.action;
            
            if (action === 'open') {
                openBinder(binder.id);
            } else if (action === 'rename') {
                showRenameModal(binder);
            } else if (action === 'delete') {
                showDeleteModal(binder);
            }
        });
    });
    
    return item;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Open a binder
function openBinder(binderId) {
    window.location.href = `/binder/${binderId}`;
}

// Show rename modal
function showRenameModal(binder) {
    const modal = new bootstrap.Modal(document.getElementById('renameBinderModal'));
    document.getElementById('newBinderName').value = binder.title;
    
    document.getElementById('confirmRenameBtn').onclick = () => {
        const newName = document.getElementById('newBinderName').value.trim();
        if (!newName) {
            alert('Name cannot be empty');
            return;
        }
        
        fetch(`/api/binders/${binder.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newName })
        })
        .then(res => res.json())
        .then(data => {
            binder.title = newName;
            loadBinders();
            modal.hide();
            showToast('✓ Binder renamed', 'success');
        })
        .catch(err => {
            console.error('Error renaming binder:', err);
            showToast('Error renaming binder', 'error');
        });
    };
    
    modal.show();
}

// Show delete modal
function showDeleteModal(binder) {
    const modal = new bootstrap.Modal(document.getElementById('deleteBinderModal'));
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const confirmInput = document.getElementById('confirmDelete');
    
    document.getElementById('deleteWarning').textContent = 
        `Deleting "${binder.title}" also deletes its ${binder.source_count} sources and all conversations. This cannot be undone.`;
    
    confirmInput.value = '';
    confirmInput.oninput = () => {
        confirmBtn.disabled = confirmInput.value !== binder.title;
    };
    
    confirmBtn.disabled = true;
    confirmBtn.onclick = () => {
        fetch(`/api/binders/${binder.id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                loadBinders();
                modal.hide();
                showToast('Binder deleted', 'info');
            })
            .catch(err => {
                console.error('Error deleting binder:', err);
                showToast('Error deleting binder', 'error');
            });
    };
    
    modal.show();
}

// Show new binder modal
function showNewBinderModal() {
    const modal = new bootstrap.Modal(document.getElementById('newBinderModal'));
    
    document.getElementById('createBinderBtn').onclick = () => {
        const name = document.getElementById('binderName').value.trim();
        const desc = document.getElementById('binderDesc').value.trim();
        
        if (!name) {
            alert('Binder name is required');
            return;
        }
        
        fetch('/api/binders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: name,
                description: desc
            })
        })
        .then(res => res.json())
        .then(binder => {
            loadBinders();
            modal.hide();
            document.getElementById('newBinderForm').reset();
            showToast('✓ Binder created', 'success');
            
            // Navigate to the new binder
            setTimeout(() => {
                openBinder(binder.id);
            }, 500);
        })
        .catch(err => {
            console.error('Error creating binder:', err);
            showToast('Error creating binder', 'error');
        });
    };
    
    modal.show();
}

// Attach event listeners
function attachEventListeners() {
    document.getElementById('new-binder-btn').addEventListener('click', showNewBinderModal);
    document.getElementById('empty-create-btn').addEventListener('click', showNewBinderModal);
    
    document.getElementById('retry-btn').addEventListener('click', () => {
        checkOllamaStatus();
    });
    
    document.getElementById('dismiss-banner').addEventListener('click', () => {
        document.getElementById('ollama-banner').classList.add('d-none');
    });
}

// Check Ollama status
function checkOllamaStatus() {
    fetch('/api/ollama/status')
        .then(res => res.json())
        .then(data => {
            const statusDot = document.querySelector('.status-dot');
            const statusText = document.querySelector('.status-text');
            const banner = document.getElementById('ollama-banner');
            
            if (data.status === 'online') {
                statusDot.classList.remove('offline');
                statusDot.classList.add('online');
                statusText.textContent = 'Ollama: qwen3:14b';
                banner.classList.add('d-none');
            } else {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
                statusText.textContent = 'Ollama: unreachable';
                banner.classList.remove('d-none');
            }
        })
        .catch(err => {
            console.error('Error checking Ollama status:', err);
            const statusDot = document.querySelector('.status-dot');
            statusDot.classList.remove('online');
            statusDot.classList.add('offline');
        });
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
