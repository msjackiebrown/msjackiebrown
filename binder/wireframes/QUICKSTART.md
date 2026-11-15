# 🔖 Binder Wireframes — Quick Start Guide

Your complete **HTML/CSS/JavaScript wireframe implementation** for Binder is ready!

## 📁 What You Got

```
wireframes/
├── index.html          ← Home (Bookshelf)
├── binder.html         ← Inside a Binder (Sources + Chat)
├── settings.html       ← Settings
├── app.css             ← All styling (Bootstrap 5 override)
├── bookshelf.js        ← Home page logic
├── binder.js           ← Binder page logic
├── settings.js         ← Settings page logic
└── README.md           ← Full documentation
```

## 🚀 How to Use

### Step 1: Open in Browser
```bash
# Simply open index.html in any modern browser
# No installation, no build, no server required
open binder/wireframes/index.html
```

Or double-click `index.html` in Windows Explorer.

### Step 2: Try the Interactions

**Home Page (Bookshelf)**
- Click "**+ New Binder**" to create a test binder
- Right-click a spine for context menu
- Click a spine to open it
- Delete a binder (type-to-confirm)

**Inside a Binder**
- Browse the sources tree on the left
- Type a message and click "**➤ Send**"
- Switch chat style: "**Default**" ↔ "**Learning Guide**"
- Create new conversations
- Add sources via the **Composer tabs** (Files, URL, Paste)

**Settings**
- Adjust model names, retrieval settings, server URLs
- Check Ollama status
- Reset sections to defaults
- Save settings

## 🎨 Design Highlights

| Feature | Location | Details |
|---------|----------|---------|
| **Bookshelf** | `index.html` | Grid of book spines with statuses (🟢 Ready, 🟡 Processing, 🔴 Error) |
| **Two-Pane Workspace** | `binder.html` | Sources tree (left) + Chat (right), fully responsive |
| **Citations** | Chat pane | Click `[n]` superscripts to expand inline quote cards |
| **Progress Tracking** | Sources pane | Per-file progress bar during ingestion |
| **Composer Tabs** | Chat footer | Ask / Files / URL / Paste — all in one interface |
| **Settings** | `settings.html` | Models, retrieval, servers, Ollama diagnostics |

## 🔧 Customization

### Change Colors
Edit `app.css` at the top:
```css
:root {
    --binder-accent: #4A90D9;      /* Change this blue to your brand color */
    --binder-bg: #FAF8F4;          /* Warm paper background */
    --status-ready: #4CAF50;       /* Green for ready */
    --status-error: #F44336;       /* Red for errors */
}
```

### Change Typography
Look for font-family and font-size in relevant sections:
```css
.binder-title {
    font-family: Georgia, serif;   /* Change serif to sans-serif if needed */
    font-variant: small-caps;      /* Remove this for regular text */
}
```

### Add Your Logo
Replace `🔖 BINDER` in the top bar with your logo:
```html
<!-- In each .html file -->
<span class="binder-brand">🏢 YOUR LOGO HERE</span>
```

## 🔌 Backend Integration

### Ready to Connect to Flask?

The wireframes use **mock data**. To connect to your backend:

1. **Replace mock binders** in `bookshelf.js`:
```javascript
// BEFORE: Mock data
let binders = [{ id: 1, title: 'Chapter 4', ... }];

// AFTER: Fetch from API
fetch('/api/binders')
    .then(res => res.json())
    .then(data => {
        binders = data;
        renderBookshelf();
    });
```

2. **Replace mock conversations** in `binder.js`:
```javascript
fetch(`/api/binders/${binderId}/conversations`)
    .then(res => res.json())
    .then(data => {
        conversations = data;
        renderConversation();
    });
```

3. **Implement message streaming** with Server-Sent Events (SSE):
```javascript
const eventSource = new EventSource(`/api/conversations/1/stream`);
eventSource.onmessage = (event) => {
    const token = event.data;
    // Append token to answer incrementally
    appendToCurrentAnswer(token);
};
```

### Backend Endpoints Needed

See the **Backend Integration Checklist** in [README.md](README.md#backend-integration-checklist) for the full list of endpoints to implement.

## 🧪 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Modern mobile browsers (responsive design down to 768px)

## 📋 Specification Reference

This implementation follows the **[Binder - Blueprint - Wireframe Spec](../docs/Binder%20-%20Blueprint%20-%20Wireframe%20Spec.md)** exactly:

- **§4** — Bookshelf design (index.html)
- **§5** — Inside a binder (binder.html)
- **§6** — Settings (settings.html)
- **§7** — Global chrome, toasts, loading states
- **§8** — Requirements traceability (FR-001 → FR-014, NFRs)

## 🆘 Troubleshooting

### Issue: Styles look broken
**Fix**: Clear browser cache (Ctrl+Shift+Delete) and reload

### Issue: Modals don't close
**Fix**: Ensure Bootstrap JS bundle is loaded from CDN (check console for errors)

### Issue: Settings don't save
**Fix**: Currently mock — implement backend endpoint `/api/settings` to persist

### Issue: No file uploads
**Fix**: File input is UI-only — implement `POST /api/binders/<id>/sources` on backend

## 📚 Documentation

- **Wireframe Spec** — [Binder - Blueprint - Wireframe Spec.md](../docs/Binder%20-%20Blueprint%20-%20Wireframe%20Spec.md)
- **Full README** — [wireframes/README.md](README.md)
- **Code Comments** — Inline comments in HTML, CSS, and JS files

## 🎯 Next Steps

1. ✅ **Explore the wireframes** — Open `index.html` and click around
2. 📝 **Review the spec** — Read the Wireframe Spec to understand requirements
3. 🔌 **Plan backend integration** — List all endpoints needed
4. 💻 **Start building Flask backend** — Implement `/api/` endpoints
5. 🔗 **Connect frontend to backend** — Replace mock data with real API calls
6. 🧪 **Test end-to-end** — Verify all interactions work with backend

## 💡 Tips

- **Keyboard shortcuts** — Currently: Tab for navigation, Enter to send messages
- **Responsive design** — Resize browser to see mobile breakpoints (1024px, 768px)
- **Dark mode** — Not yet implemented; request in future iterations
- **Accessibility** — All controls are keyboard-accessible with focus rings
- **Performance** — Everything runs locally; no server needed for wireframes

## 📞 Questions?

Refer to:
- **Wireframe Spec §9** — Open design questions
- **README.md** — Full API documentation and integration guide
- **Code comments** — Inline explanations in .js and .html files

---

**🎉 You're ready! Open `index.html` and start exploring the Binder wireframes.**
