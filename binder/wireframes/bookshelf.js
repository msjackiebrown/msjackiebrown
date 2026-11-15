// ============================================================
// BINDER — Bookshelf (Home) Page JavaScript
// ============================================================

// Mock data — replace with API calls when backend is ready
let binders = [
    {
        id: 1,
        title: 'Chapter 4',
        description: 'Latest course notes',
        sources: 24,
        status: 'ready',
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
        id: 2,
        title: 'Database',
        description: 'SQL learning materials',
        sources: 6,
        status: 'processing',
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
        id: 3,
        title: 'Learning Guide',
        description: 'Socratic method examples',
        sources: 24,
        status: 'ready',
        lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: 4,
        title: 'Python',
        description: 'Advanced patterns',
        sources: 12,
        status: 'ready',
        lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
        id: 5,
        title: 'AI Papers',
        description: 'Recent research',
        sources: 8,
        status: 'ready',
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: 6,
        title: 'Web Design',
        description: 'UI/UX principles',
        sources: 15,
        status: 'error',
        lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
];

let currentBinder = null;
const SPINES_PER_SHELF = 10;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBookshelf();
    attachEventListeners();
    checkOllamaStatus();
});

// Render the bookshelf
function renderBookshelf() {
    const bookshelf = document.getElementById('bookshelf');
    const emptyState = document.getElementById('empty-state');

    bookshelf.innerHTML = '';

    if (binders.length === 0) {
        emptyState.classList.remove('d-none');
        return;
    }

    emptyState.classList.add('d-none');

    // Sort by last updated (most recent first)
    const sorted = [...binders].sort((a, b) => b.lastUpdated - a.lastUpdated);

    // Create shelves
    const shelves = [];
    for (let i = 0; i < sorted.length; i += SPINES_PER_SHELF) {
        shelves.push(sorted.slice(i, i + SPINES_PER_SHELF));
    }

    shelves.forEach((shelf, shelfIndex) => {
        const shelfDiv = document.createElement('div');
        shelfDiv.className = 'bookshelf';
        shelfDiv.style.gridTemplateColumns = `repeat(${shelf.length}, 1fr)`;

        shelf.forEach((binder) => {
            const spine = createSpineElement(binder);
            shelfDiv.appendChild(spine);
        });

        bookshelf.appendChild(shelfDiv);
    });

    // Update shelf counter
    document.querySelector('.shelf-counter').textContent = `shelf: 1 of ${shelves.length}`;
}

// Create a single spine (book)
function createSpineElement(binder) {
    const spine = document.createElement('div');
    spine.className = `spine status-${binder.status}`;
    spine.dataset.binderId = binder.id;
    spine.title = `${binder.title}\n${binder.sources} sources\nUpdated: ${binder.lastUpdated.toLocaleString()}`;

    const title = document.createElement('div');
    title.className = 'spine-title';
    title.textContent = binder.title;

    const sources = document.createElement('div');
    sources.className = 'spine-sources';
    sources.textContent = `📄 ${binder.sources}`;

    const status = document.createElement('div');
    status.className = 'spine-status';
    const statusDot = document.createElement('span');
    statusDot.className = `status-dot ${getStatusClass(binder.status)}`;
    status.appendChild(statusDot);

    spine.appendChild(title);
    spine.appendChild(sources);
    spine.appendChild(status);

    // Event listeners
    spine.addEventListener('click', () => openBinder(binder.id));
    spine.addEventListener('contextmenu', (e) => showContextMenu(e, binder));

    return spine;
}

// Get status class based on status
function getStatusClass(status) {
    switch (status) {
        case 'ready':
            return 'online'; // Green
        case 'processing':
            return 'processing'; // Yellow (need to add to CSS)
        case 'error':
            return 'offline'; // Red
        default:
            return 'empty';
    }
}

// Open a binder
function openBinder(binderId) {
    const binder = binders.find(b => b.id === binderId);
    if (binder) {
        // In a real app, navigate to /binder/<id>
        window.location.href = `binder.html?id=${binderId}`;
    }
}

// Context menu for spine
function showContextMenu(e, binder) {
    e.preventDefault();

    const menu = document.getElementById('contextMenu');
    menu.classList.remove('d-none');
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    // Clear previous listeners and attach new ones
    const items = menu.querySelectorAll('.context-menu-item');
    items.forEach(item => {
        item.onclick = null; // Clear previous
    });

    menu.querySelector('[data-action="open"]').onclick = () => {
        openBinder(binder.id);
    };

    menu.querySelector('[data-action="rename"]').onclick = () => {
        showRenameModal(binder);
        menu.classList.add('d-none');
    };

    menu.querySelector('[data-action="delete"]').onclick = () => {
        showDeleteModal(binder);
        menu.classList.add('d-none');
    };

    // Close menu when clicking elsewhere
    document.addEventListener('click', () => {
        menu.classList.add('d-none');
    }, { once: true });
}

// Show rename modal
function showRenameModal(binder) {
    const modal = new bootstrap.Modal(document.getElementById('renameBinderModal'));
    document.getElementById('newBinderName').value = binder.title;

    document.getElementById('confirmRenameBtn').onclick = () => {
        const newName = document.getElementById('newBinderName').value.trim();
        if (newName) {
            binder.title = newName;
            renderBookshelf();
            modal.hide();
            showToast('✓ Binder renamed', 'success');
        }
    };

    modal.show();
}

// Show delete modal
function showDeleteModal(binder) {
    const modal = new bootstrap.Modal(document.getElementById('deleteBinderModal'));
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const confirmInput = document.getElementById('confirmDelete');

    document.getElementById('deleteWarning').textContent = 
        `Deleting "${binder.title}" also deletes its ${binder.sources} sources, its ChromaDB collection, and all conversations. This cannot be undone.`;

    confirmInput.value = '';
    confirmInput.oninput = () => {
        confirmBtn.disabled = confirmInput.value !== binder.title;
    };

    confirmBtn.disabled = true;
    confirmBtn.onclick = () => {
        binders = binders.filter(b => b.id !== binder.id);
        renderBookshelf();
        modal.hide();
        showToast('Binder deleted', 'info');
    };

    modal.show();
}

// New binder modal
function showNewBinderModal() {
    const modal = new bootstrap.Modal(document.getElementById('newBinderModal'));

    document.getElementById('createBinderBtn').onclick = () => {
        const name = document.getElementById('binderName').value.trim();
        const desc = document.getElementById('binderDesc').value.trim();

        if (!name) {
            alert('Binder name is required');
            return;
        }

        const newBinder = {
            id: Math.max(...binders.map(b => b.id), 0) + 1,
            title: name,
            description: desc || 'No description',
            sources: 0,
            status: 'empty',
            lastUpdated: new Date(),
        };

        binders.push(newBinder);
        renderBookshelf();
        modal.hide();
        document.getElementById('newBinderForm').reset();

        // Navigate to the new binder
        showToast('✓ Binder created', 'success');
        setTimeout(() => {
            window.location.href = `binder.html?id=${newBinder.id}`;
        }, 1000);
    };

    modal.show();
}

// Attach event listeners
function attachEventListeners() {
    // New binder buttons
    document.getElementById('new-binder-btn').addEventListener('click', showNewBinderModal);
    document.getElementById('empty-create-btn').addEventListener('click', showNewBinderModal);
    document.getElementById('bottom-new-binder-btn').addEventListener('click', showNewBinderModal);

    // Ollama retry
    document.getElementById('retry-btn').addEventListener('click', () => {
        checkOllamaStatus();
    });

    document.getElementById('dismiss-banner').addEventListener('click', () => {
        document.getElementById('ollama-banner').classList.add('d-none');
    });
}

// Check Ollama status
function checkOllamaStatus() {
    // In a real app, make an API call to check Ollama
    const isOnline = Math.random() > 0.1; // 90% chance it's online

    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    const banner = document.getElementById('ollama-banner');

    if (isOnline) {
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

// Close context menu when clicking elsewhere
document.addEventListener('click', (e) => {
    const menu = document.getElementById('contextMenu');
    if (!menu.contains(e.target) && e.target.className !== 'spine') {
        menu.classList.add('d-none');
    }
});
