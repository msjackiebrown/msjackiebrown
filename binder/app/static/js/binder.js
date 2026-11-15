// ============================================================
// BINDER — Inside a Binder Page JavaScript (Flask Version)
// ============================================================

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    attachEventListeners();
});

// Load conversations from API
function loadConversations() {
    fetch(`/api/binders/${binderData.id}/conversations`)
        .then(res => res.json())
        .then(conversations => {
            if (conversations.length === 0) {
                // Create first conversation
                return fetch(`/api/binders/${binderData.id}/conversations`, {
                    method: 'POST'
                }).then(res => res.json());
            }
            return conversations[0];
        })
        .then(convo => {
            loadMessages(convo.id);
        })
        .catch(err => console.error('Error loading conversations:', err));
}

// Load messages from API
function loadMessages(conversationId) {
    fetch(`/api/conversations/${conversationId}/messages`)
        .then(res => res.json())
        .then(messages => {
            renderMessages(messages);
        })
        .catch(err => console.error('Error loading messages:', err));
}

// Render messages in container
function renderMessages(messages) {
    const container = document.getElementById('messages-container');
    container.innerHTML = '';
    
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.role}`;
        
        const card = document.createElement('div');
        card.className = 'message-card';
        card.textContent = msg.content;
        
        msgDiv.appendChild(card);
        
        if (msg.style) {
            const styleDiv = document.createElement('div');
            styleDiv.className = 'message-style';
            styleDiv.textContent = msg.style;
            msgDiv.appendChild(styleDiv);
        }
        
        container.appendChild(msgDiv);
    });
    
    container.scrollTop = container.scrollHeight;
}

// Send message
function sendMessage() {
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    
    if (!content) return;
    
    const conversationId = document.getElementById('current-convo').textContent;
    
    fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            role: 'user',
            content: content
        })
    })
    .then(res => res.json())
    .then(msg => {
        input.value = '';
        loadMessages(conversationId);
        showToast('✓ Message sent', 'success');
        
        // Simulate assistant response after 1 second
        setTimeout(() => {
            fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role: 'assistant',
                    content: 'This is a simulated response. Connect to Ollama backend to get real responses.',
                    style: 'Default'
                })
            })
            .then(res => res.json())
            .then(() => {
                loadMessages(conversationId);
            });
        }, 1000);
    })
    .catch(err => {
        console.error('Error sending message:', err);
        showToast('Error sending message', 'error');
    });
}

// Attach event listeners
function attachEventListeners() {
    // Send button
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    
    // Enter to send
    document.getElementById('message-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // New chat button
    document.getElementById('new-chat-btn').addEventListener('click', () => {
        fetch(`/api/binders/${binderData.id}/conversations`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(convo => {
            document.getElementById('current-convo').textContent = convo.id;
            loadMessages(convo.id);
            showToast('✓ New conversation started', 'success');
        })
        .catch(err => {
            console.error('Error creating conversation:', err);
            showToast('Error creating conversation', 'error');
        });
    });
    
    // Delete chat button
    document.getElementById('delete-chat-btn').addEventListener('click', () => {
        const conversationId = document.getElementById('current-convo').textContent;
        if (confirm('Delete this conversation?')) {
            fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' })
                .then(res => res.json())
                .then(data => {
                    loadConversations();
                    showToast('Conversation deleted', 'info');
                })
                .catch(err => {
                    console.error('Error deleting conversation:', err);
                    showToast('Error deleting conversation', 'error');
                });
        }
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
