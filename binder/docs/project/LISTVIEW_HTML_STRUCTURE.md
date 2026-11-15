# Binder Home Page - Listview HTML Structure

## Page Layout

```
<body class="bookshelf-page">
  
  <!-- Top Navigation Bar -->
  <nav class="top-bar">
    <div class="binder-brand">🔖 BINDER</div>
    <div class="ollama-status">⚫ Ollama: qwen3:14b</div>
    <a class="settings-link">⚙ Settings</a>
  </nav>

  <!-- Ollama Status Banner (hidden by default) -->
  <div class="ollama-banner alert alert-warning d-none">
    ⚠ Ollama unreachable...
  </div>

  <!-- Main Content -->
  <main class="binders-main">
    <div class="binders-container">

      <!-- Header: Title + New Button -->
      <div class="binders-header">
        <h1 class="binders-title">My Binders</h1>
        <button class="btn btn-primary" id="new-binder-btn">+ New Binder</button>
      </div>

      <!-- Empty State: Shown when no binders -->
      <div id="empty-state" class="empty-state">
        <h2>Your binder collection is empty.</h2>
        <button class="btn btn-primary btn-lg" id="empty-create-btn">
          + Create your first binder
        </button>
      </div>

      <!-- Listview: Shown when binders exist -->
      <div id="binders-listview" class="binders-listview">
        
        <!-- Table Header Row (Sticky) -->
        <div class="list-header">
          <div class="col-name">Name</div>
          <div class="col-description">Description</div>
          <div class="col-sources">Sources</div>
          <div class="col-dates">Created</div>
          <div class="col-modified">Modified</div>
          <div class="col-actions">Actions</div>
        </div>

        <!-- Scrollable Items Container -->
        <div id="binders-list" class="list-items">

          <!-- Individual Binder Row -->
          <div class="list-item status-ready" data-binder-id="abc123">
            
            <div class="col-name">
              <span class="status-indicator"></span>
              <span class="binder-name" title="Full title">PARA System</span>
            </div>

            <div class="col-description">
              <span class="binder-desc">Personal knowledge management</span>
            </div>

            <div class="col-sources">
              <span class="source-badge">📄 5</span>
            </div>

            <div class="col-dates">
              <span class="binder-created">Nov 14, 2026</span>
            </div>

            <div class="col-modified">
              <span class="binder-modified">Nov 14, 2026</span>
            </div>

            <div class="col-actions">
              <button class="btn-action btn-open" data-action="open">📖</button>
              <button class="btn-action btn-rename" data-action="rename">✏</button>
              <button class="btn-action btn-delete" data-action="delete">🗑</button>
            </div>

          </div>
          <!-- ... repeat for each binder ... -->

        </div>

      </div>

      <!-- Footer: Binder Count -->
      <div id="binders-footer" class="binders-footer">
        <span class="binder-count">5 binders</span>
      </div>

    </div>
  </main>

  <!-- Modals (Create, Rename, Delete) -->
  <!-- ... Bootstrap modals ... -->

</body>
```

## CSS Grid Layout

### List Header Grid
```css
.list-header {
  display: grid;
  grid-template-columns: 200px 1fr 120px 120px 120px 120px;
  gap: 16px;
}
```

### List Item Grid (same columns)
```css
.list-item {
  display: grid;
  grid-template-columns: 200px 1fr 120px 120px 120px 120px;
  gap: 16px;
}
```

### Visual Representation
```
┌──────────┬─────────────────────────┬──────────┬──────────┬──────────┬──────┐
│ 200px    │ flexible (1fr)          │ 120px    │ 120px    │ 120px    │ 120px│
│ Name     │ Description             │ Sources  │ Created  │ Modified │ Act. │
└──────────┴─────────────────────────┴──────────┴──────────┴──────────┴──────┘
```

## Component States

### Binder Row - Status Variants

#### Ready (processing complete)
```html
<div class="list-item status-ready" data-binder-id="id">
  <!-- status-indicator will be green -->
</div>
```

#### Processing (ingesting sources)
```html
<div class="list-item status-processing" data-binder-id="id">
  <!-- status-indicator will be yellow -->
</div>
```

#### Error (processing failed)
```html
<div class="list-item status-error" data-binder-id="id">
  <!-- status-indicator will be red -->
</div>
```

## Dynamic Content from API

### Binder Object (from `/api/binders`)
```json
{
  "id": "abc123",
  "title": "PARA System",
  "description": "Personal knowledge management system",
  "status": "ready",
  "source_count": 5,
  "created_at": "2026-11-14T10:30:00",
  "updated_at": "2026-11-14T15:45:00"
}
```

### Rendered HTML
```html
<div class="list-item status-ready" data-binder-id="abc123">
  <div class="col-name">
    <span class="status-indicator"></span>
    <span class="binder-name" title="PARA System">PARA System</span>
  </div>
  <div class="col-description">
    <span class="binder-desc" title="Personal knowledge management system">
      Personal knowledge management system
    </span>
  </div>
  <div class="col-sources">
    <span class="source-badge">📄 5</span>
  </div>
  <div class="col-dates">
    <span class="binder-created">Nov 14, 2026</span>
  </div>
  <div class="col-modified">
    <span class="binder-modified">Nov 14, 2026</span>
  </div>
  <div class="col-actions">
    <button class="btn-action btn-open" title="Open" data-action="open">📖</button>
    <button class="btn-action btn-rename" title="Rename" data-action="rename">✏</button>
    <button class="btn-action btn-delete text-danger" title="Delete" data-action="delete">🗑</button>
  </div>
</div>
```

## Column Specifications

### col-name (200px)
```html
<div class="col-name">
  <span class="status-indicator"></span>
  <span class="binder-name" title="Full Title">Shortened Title</span>
</div>
```
- **Width**: 200px (fixed)
- **Content**: Status dot + title
- **Styling**: Flexbox, gap 10px, centered vertically
- **Typography**: Font-weight 500
- **Truncation**: ellipsis if name > 200px
- **Tooltip**: Full title on hover

### col-description (flexible)
```html
<div class="col-description">
  <span class="binder-desc" title="Full description...">
    Truncated description...
  </span>
</div>
```
- **Width**: 1fr (fills available space)
- **Content**: Description text
- **Styling**: Color #666, font-size 14px
- **Truncation**: ellipsis if text too long
- **Tooltip**: Full description on hover
- **Empty**: Shows "—" (dash)

### col-sources (120px)
```html
<div class="col-sources">
  <span class="source-badge">📄 5</span>
</div>
```
- **Width**: 120px (fixed)
- **Content**: Badge with icon + count
- **Badge Styling**:
  - Background: #e3f2fd (light blue)
  - Color: #1976d2 (dark blue)
  - Padding: 4px 8px
  - Border-radius: 12px
  - Font-weight: 500
- **Alignment**: Center text align
- **Value**: Number of sources in this binder

### col-dates (120px)
```html
<div class="col-dates">
  <span class="binder-created">Nov 14, 2026</span>
</div>
```
- **Width**: 120px (fixed)
- **Format**: `MMM DD, YYYY` (e.g., "Nov 14, 2026")
- **Alignment**: Center text align
- **Color**: #999 (gray)
- **Font-size**: 13px
- **Empty**: Shows "—"

### col-modified (120px)
```html
<div class="col-modified">
  <span class="binder-modified">Nov 14, 2026</span>
</div>
```
- **Width**: 120px (fixed)
- **Format**: `MMM DD, YYYY`
- **Alignment**: Center text align
- **Color**: #999
- **Font-size**: 13px
- **Empty**: Shows "—"
- **Purpose**: Highlights recently worked-on binders

### col-actions (120px)
```html
<div class="col-actions">
  <button class="btn-action btn-open" title="Open" data-action="open">📖</button>
  <button class="btn-action btn-rename" title="Rename" data-action="rename">✏</button>
  <button class="btn-action btn-delete" title="Delete" data-action="delete">🗑</button>
</div>
```
- **Width**: 120px (fixed)
- **Content**: 3 action buttons
- **Layout**: Flexbox, centered, gap 8px
- **Button Styling**:
  - Background: none
  - Border: none
  - Font-size: 16px
  - Cursor: pointer
  - Opacity: 0.6 (default), 1.0 (hover)
  - Padding: 4px 8px
- **Hover Effect**: scale(1.1)
- **Color on Hover**:
  - Open: Blue (#4A90D9)
  - Rename: Orange (#ff9800)
  - Delete: Red (#F44336)

## Event Handlers

### Row Click Handler
```javascript
item.addEventListener('click', (e) => {
  if (!e.target.closest('.btn-action')) {
    // Only navigate if not clicking a button
    openBinder(binder.id);
  }
});
```

### Action Button Handlers
```javascript
const actionBtns = item.querySelectorAll('.btn-action');
actionBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent row click
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
```

## Responsive Considerations

### Current Implementation
- Fixed column widths work well for desktop
- Min-width on container: 1200px

### Future Mobile Support
Consider hiding/rearranging columns:
- **Tablet** (768px-1199px): Hide "Created" column
- **Mobile** (<768px): Show card-view or 2-column layout

```css
@media (max-width: 1024px) {
  .list-header, .list-item {
    grid-template-columns: 150px 1fr 100px 100px 100px;
  }
  .col-dates { display: none; }
}

@media (max-width: 640px) {
  .list-header, .list-item {
    grid-template-columns: 100px 1fr 60px;
  }
  .col-description,
  .col-modified { display: none; }
  .source-badge { font-size: 11px; }
}
```

## Accessibility Features

- `title` attributes on truncated text (name, description)
- Semantic HTML with proper div roles
- Color not sole indicator (status dot + text still visible)
- Keyboard navigable (tab through buttons)
- ARIA labels on action buttons
- Good contrast ratios (WCAG AA compliant)

## Performance Optimizations

- **Event Delegation**: Single listener on container
- **Minimal DOM**: No excessive wrapper divs
- **CSS Grid**: Hardware-accelerated layout
- **Virtual Scrolling**: Consider for 100+ items
- **Lazy Rendering**: Consider for large lists
