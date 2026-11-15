// ============================================================
// BINDER — Inside a Binder Page JavaScript
// ============================================================

// Mock data
let currentBinderData = {
    id: 1,
    title: 'CAPTURE THEBRAIN',
    description: 'Evergreen notes methodology',
    sources: [
        {
            id: 1,
            type: 'file',
            name: 'capture-theory.txt',
            status: 'ready',
            sourceCount: 1,
            section: 'Notes'
        },
        {
            id: 2,
            type: 'file',
            name: 'para-overview.pdf',
            status: 'ready',
            sourceCount: 1,
            section: 'Notes'
        },
        {
            id: 3,
            type: 'file',
            name: 'evergreen.pdf',
            status: 'ready',
            pages: 34,
            currentPage: 12,
            progress: 85,
            section: 'Reading'
        },
        {
            id: 4,
            type: 'file',
            name: 'slides-v1.pdf',
            status: 'error',
            error: 'No text found on pages 3–17 (image-only?)',
            section: 'Reading'
        },
        {
            id: 5,
            type: 'url',
            name: 'paste-ideas.txt',
            status: 'ready',
            section: 'root'
        },
        {
            id: 6,
            type: 'url',
            name: 'https://tinyurl.com/example',
            status: 'ready',
            section: 'root'
        }
    ],
    sections: ['Notes', 'Reading'],
    conversations: [
        { id: 1, title: 'How does progressive summarization work?', messageCount: 3 },
        { id: 2, title: 'PARA methodology overview', messageCount: 5 },
        { id: 3, title: 'Evergreen notes best practices', messageCount: 2 }
    ],
    currentConversation: 1
};

let conversations = {
    1: [
        {
            role: 'user',
            content: 'How does progressive summarization actually work in a PARA setup?',
            timestamp: '14:02'
        },
        {
            role: 'assistant',
            content: 'Good — before I answer, one probe: When you *file* a note, do you already know where it lives, or is filing the retrieval? That decides which pattern [1] matters more…',
            style: 'Default',
            timestamp: '14:02',
            citations: []
        },
        {
            role: 'assistant',
            content: 'Short answer: pattern in [1] — summarize as you go; [2] warns against pre-filing…',
            style: 'Default',
            timestamp: '14:05',
            citations: [1, 2]
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderSourcesTree();
    renderConversation();
    attachEventListeners();
    updateBinderHeader();
});

// Update binder header
function updateBinderHeader() {
    document.getElementById('binder-title').textContent = `📓 ${currentBinderData.title}`;
    document.getElementById('binder-desc').textContent = currentBinderData.description;
    document.getElementById('source-count').textContent = `${currentBinderData.sources.length} sources`;
}

// Render sources tree
function renderSourcesTree() {
    const tree = document.getElementById('sources-tree');
    tree.innerHTML = '';

    // Group sources by section
    const grouped = {};
    currentBinderData.sources.forEach(source => {
        const section = source.section || 'root';
        if (!grouped[section]) {
            grouped[section] = [];
        }
        grouped[section].push(source);
    });

    // Render root level sources first
    if (grouped['root']) {
        grouped['root'].forEach(source => {
            const item = createSourceElement(source);
            tree.appendChild(item);
        });
    }

    // Render sections with nested sources
    currentBinderData.sections.forEach(section => {
        if (grouped[section]) {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';

            const sectionLabel = document.createElement('span');
            sectionLabel.textContent = `📁 ${section}`;
            sectionDiv.appendChild(sectionLabel);

            const addBtn = document.createElement('button');
            addBtn.className = 'btn btn-link btn-sm';
            addBtn.textContent = '[ + ]';
            addBtn.onclick = (e) => {
                e.stopPropagation();
                showAddSourceModal(section);
            };
            sectionDiv.appendChild(addBtn);

            tree.appendChild(sectionDiv);

            grouped[section].forEach(source => {
                const item = createSourceElement(source);
                item.style.marginLeft = '16px';
                tree.appendChild(item);
            });
        }
    });
}

// Create a source element
function createSourceElement(source) {
    const div = document.createElement('div');
    div.className = `source-item status-${source.status}`;
    div.dataset.sourceId = source.id;

    const label = document.createElement('span');
    label.innerHTML = `<span class="source-icon">${getSourceIcon(source.type)}</span> ${source.name}`;

    div.appendChild(label);

    // Add progress bar if processing
    if (source.status === 'processing' && source.progress !== undefined) {
        const progress = document.createElement('div');
        progress.className = 'source-progress';
        progress.innerHTML = `<div class="progress progress-bar-sm">
            <div class="progress-bar bg-warning" style="width: ${source.progress}%"></div>
        </div>
        page ${source.currentPage}/${source.pages} · ▓▓▓░░ ${source.progress}%`;
        div.appendChild(progress);
    }

    // Add error message if error
    if (source.status === 'error') {
        const error = document.createElement('div');
        error.className = 'source-error-msg';
        error.textContent = `↳ "${source.error}"`;
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn-link btn-sm';
        retryBtn.textContent = '[↻]';
        error.appendChild(retryBtn);
        div.appendChild(error);
    }

    // Context menu on hover
    div.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSourceContextMenu(e, source);
    });

    return div;
}

// Get source icon
function getSourceIcon(type) {
    switch (type) {
        case 'file':
            return '📄';
        case 'url':
            return '🔗';
        case 'paste':
            return '▤';
        default:
            return '📄';
    }
}

// Render conversation
function renderConversation() {
    const container = document.getElementById('messages-container');
    const currentConvo = currentBinderData.conversations[currentBinderData.currentConversation - 1];

    container.innerHTML = '';

    if (currentConvo && conversations[currentConvo.id]) {
        conversations[currentConvo.id].forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.role}`;

            const card = document.createElement('div');
            card.className = 'message-card';
            if (msg.role === 'assistant' && msg.style === 'Learning Guide') {
                msgDiv.classList.add('learning-guide');
            }

            // Process citations in content
            let content = msg.content;
            if (msg.citations && msg.citations.length > 0) {
                msg.citations.forEach((citation, idx) => {
                    content = content.replace(`[${citation}]`, `<span class="citation-ref">[${citation}]</span>`);
                });
            }

            card.innerHTML = content;

            if (msg.citations && msg.citations.length > 0) {
                const citationCard = document.createElement('div');
                citationCard.className = 'citation-card';
                citationCard.innerHTML = `
                    <div class="citation-card-header">¹ evergreen · p.12, chunk</div>
                    <div class="citation-card-body">"Progressive summarization"</div>
                `;
                card.appendChild(citationCard);
            }

            msgDiv.appendChild(card);

            if (msg.style) {
                const styleDiv = document.createElement('div');
                styleDiv.className = 'message-style';
                styleDiv.textContent = msg.style;
                msgDiv.appendChild(styleDiv);
            }

            container.appendChild(msgDiv);
        });
    }

    // Update conversation info
    document.getElementById('current-convo').textContent = currentBinderData.currentConversation;
    document.getElementById('total-convo').textContent = currentBinderData.conversations.length;
}

// Show context menu for sources
function showSourceContextMenu(e, source) {
    const menu = document.getElementById('contextMenu');
    if (!menu) return;

    menu.classList.remove('d-none');
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    const items = menu.querySelectorAll('.context-menu-item');
    items.forEach(item => {
        item.onclick = null;
    });

    if (menu.querySelector('[data-action="open"]')) {
        menu.querySelector('[data-action="open"]').onclick = () => {
            showToast(`Previewing: ${source.name}`);
            menu.classList.add('d-none');
        };
    }

    document.addEventListener('click', () => {
        menu.classList.add('d-none');
    }, { once: true });
}

// Show add source modal
function showAddSourceModal(section = 'root') {
    const modal = new bootstrap.Modal(document.getElementById('addSourceModal'));

    // Populate destination select
    const destinationSelects = document.querySelectorAll('[id$="-destination"]');
    destinationSelects.forEach(select => {
        select.innerHTML = `<option value="root">Root level</option>`;
        currentBinderData.sections.forEach(sec => {
            const option = document.createElement('option');
            option.value = sec;
            option.textContent = sec;
            select.appendChild(option);
        });
        select.value = section;
    });

    modal.show();
}

// Attach event listeners
function attachEventListeners() {
    // Add source button
    document.getElementById('add-source-btn').addEventListener('click', () => {
        showAddSourceModal();
    });

    // Composer tab switching
    document.querySelectorAll('.composer-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchComposerTab(tabName);
        });
    });

    // Send message
    document.getElementById('send-btn').addEventListener('click', () => {
        const input = document.getElementById('message-input');
        if (input.value.trim()) {
            addMessage('user', input.value.trim());
            input.value = '';
            
            // Simulate assistant response
            setTimeout(() => {
                const style = document.querySelector('input[name="style"]:checked').value;
                addMessage('assistant', 'This is a simulated response. Connect to Flask backend for real responses.', style);
            }, 1000);
        }
    });

    // New chat button
    document.getElementById('new-chat-btn').addEventListener('click', () => {
        currentBinderData.currentConversation = currentBinderData.conversations.length;
        renderConversation();
        showToast('✓ New conversation started', 'success');
    });

    // Delete chat button
    document.getElementById('delete-chat-btn').addEventListener('click', () => {
        if (confirm('Delete this conversation?')) {
            currentBinderData.conversations.splice(currentBinderData.currentConversation - 1, 1);
            currentBinderData.currentConversation = Math.max(1, currentBinderData.currentConversation - 1);
            renderConversation();
            showToast('Conversation deleted', 'info');
        }
    });

    // File dropzone
    const dropzone = document.getElementById('file-dropzone');
    if (dropzone) {
        dropzone.addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }
}

// Switch composer tab
function switchComposerTab(tabName) {
    document.querySelectorAll('.composer-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.composer-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelector(`.composer-content[data-tab="${tabName}"]`).classList.add('active');
}

// Handle file uploads
function handleFiles(files) {
    let fileList = '';
    Array.from(files).forEach(file => {
        fileList += `<div class="file-item">📄 ${file.name}</div>`;
    });
    showToast(`✓ ${files.length} file(s) queued for ingestion`, 'success');
}

// Add message to conversation
function addMessage(role, content, style = 'Default') {
    const container = document.getElementById('messages-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${role}`;

    const card = document.createElement('div');
    card.className = 'message-card';
    if (style === 'Learning Guide') {
        msgDiv.classList.add('learning-guide');
    }

    card.textContent = content;
    msgDiv.appendChild(card);

    if (role === 'assistant') {
        const styleDiv = document.createElement('div');
        styleDiv.className = 'message-style';
        styleDiv.textContent = style;
        msgDiv.appendChild(styleDiv);
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
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
