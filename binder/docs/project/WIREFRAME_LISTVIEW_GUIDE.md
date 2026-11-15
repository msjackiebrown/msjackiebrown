# Binder Home Page - Listview Wireframe Guide

## Before & After

### Previous Design: Bookshelf Spine Layout
```
┌─────────────────────────────────────────────────┐
│  🔖 BINDER    |    Ollama: qwen3:14b    |  ⚙     │
└─────────────────────────────────────────────────┘

      ╔═══╗  ╔═══╗  ╔═══╗  ╔═══╗
      ║ CA║  ║ PA║  ║ RA║  ║ DA║  
      ║ P║  ║ RA║  ║ G ║  ║ TA║
      ║---║  ║---║  ║---║  ║---║
      ║📄5║  ║📄2║  ║📄8║  ║📄3║
      ╚═══╝  ╚═══╝  ╚═══╝  ╚═══╝
        ⭕    ⭕     ⭕      ⭕
      Status Status  Status Status
```
- Vertical book spines with abbreviated titles
- Shows only title (3 letters) and source count
- Must hover to see full title and dates

### New Design: Listview Table Layout
```
┌─────────────────────────────────────────────────┐
│  🔖 BINDER    |    Ollama: qwen3:14b    |  ⚙     │
└─────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ My Binders                                  + New Binder     │
└──────────────────────────────────────────────────────────────┘

┌──────────┬─────────────────┬──────────┬──────────┬──────────┬──────┐
│ Name     │ Description     │ Sources  │ Created  │ Modified │ Act. │
├──────────┼─────────────────┼──────────┼──────────┼──────────┼──────┤
│ ⭕ PARA  │ Personal knowl… │ 📄 5     │ Nov 14   │ Nov 14   │ 📖✏🗑│
├──────────┼─────────────────┼──────────┼──────────┼──────────┼──────┤
│ ⭕ Goals │ 2025 goals & t…│ 📄 2     │ Oct 01   │ Nov 10   │ 📖✏🗑│
├──────────┼─────────────────┼──────────┼──────────┼──────────┼──────┤
│ ⭕ RAG   │ RAG architecture│ 📄 8     │ Sep 15   │ Nov 12   │ 📖✏🗑│
├──────────┼─────────────────┼──────────┼──────────┼──────────┼──────┤
│ ⭕ Data  │ Database design │ 📄 3     │ Aug 20   │ Nov 08   │ 📖✏🗑│
└──────────┴─────────────────┴──────────┴──────────┴──────────┴──────┘

3 binders
```
- Full title always visible
- Description, source count, created/modified dates at a glance
- Inline action buttons
- Shows all information without scrolling/hovering

## Column Details

### Name (200px)
```
⭕ PARA System Notes
```
- Status indicator (colored dot)
- Full binder title (truncated with ellipsis if > 200px)
- Hover shows full title in tooltip

### Description (Flexible)
```
Personal knowledge management and note-taking system
```
- One-line description
- Truncated with ellipsis if too long
- Shows "—" if empty
- Tooltip shows full text on hover

### Sources (120px)
```
📄 5
```
- Paper/page emoji + count
- Blue badge background
- Centered alignment
- Helps quickly identify which binders have content

### Created (120px)
```
Nov 14, 2026
```
- Date format: `MMM DD, YYYY`
- Centered alignment
- Shows "—" if not available
- Helps find old vs. new binders

### Modified (120px)
```
Nov 14, 2026
```
- Date format: `MMM DD, YYYY`
- Centered alignment
- Shows "—" if not available
- Highlights recently worked-on binders

### Actions (120px)
```
📖 ✏️ 🗑️
```
Three action buttons:
- **📖 Open** - Navigate to binder (also triggered by row click)
- **✏️ Rename** - Opens rename modal
- **🗑️ Delete** - Opens delete confirmation

## Status Indicator Colors

| Status | Color | Meaning |
|--------|-------|---------|
| 🟢 Green | `#4CAF50` | Ready - fully processed |
| 🟡 Yellow | `#FFC107` | Processing - ingesting sources |
| 🔴 Red | `#F44336` | Error - failed processing |
| ⚪ Gray | `#9E9E9E` | Empty - no sources added |

## Interactions

### Row Click (anywhere except action buttons)
→ Navigates to the binder

### Action Button Click
→ Performs that specific action without navigation

### Hover Effects
- Row background changes to light gray
- Action buttons opacity changes from 0.6 to 1.0
- Cursor changes to pointer

## Empty State

When no binders exist:
```
┌─────────────────────────────────────────────────┐
│  🔖 BINDER    |    Ollama: qwen3:14b    |  ⚙     │
└─────────────────────────────────────────────────┘

        ┌──────────────────────────────┐
        │ Your binder collection is    │
        │ empty.                       │
        │                              │
        │ Start organizing your        │
        │ knowledge base.              │
        │                              │
        │ [+ Create your first binder] │
        └──────────────────────────────┘
```

## Responsive Design Strategy

Current breakpoints handle:
- **Desktop** (1200px+): Full layout with all columns
- **Tablet** (768-1199px): Consider hiding Created column
- **Mobile** (<768px): Consider showing card view or scroll

## Performance Considerations

### Current
- Loads all binders in a single table
- Good for up to ~50-100 binders
- Fast rendering with simple HTML grid

### Future (as collection grows)
- Add pagination (20 binders per page)
- Implement virtual scrolling for 100+ items
- Add search/filter to reduce visible rows
- Consider lazy-loading images/icons

## Accessibility

- All buttons have `title` attributes
- Proper contrast ratios for status indicators
- Keyboard navigation with tab/enter
- Screen reader labels on action buttons
- Semantic HTML with proper ARIA roles

## CSS Classes Reference

### Container Structure
- `.binders-main` - Main content wrapper
- `.binders-container` - Max-width wrapper (1200px)
- `.binders-header` - Header with title + button
- `.binders-listview` - Table container
- `.binders-footer` - Footer with count

### List Structure
- `.list-header` - Column headers (sticky)
- `.list-items` - Scrollable items container
- `.list-item` - Individual row
- `.list-item.status-{ready|processing|error}` - Status variant

### Column Classes
- `.col-name` - Name column
- `.col-description` - Description column
- `.col-sources` - Sources column
- `.col-dates` - Created date column
- `.col-modified` - Modified date column
- `.col-actions` - Actions column

### Component Classes
- `.status-indicator` - Colored dot
- `.source-badge` - Blue badge for count
- `.btn-action` - Action button
- `.btn-open`, `.btn-rename`, `.btn-delete` - Specific action variants

## JavaScript Functions

### Rendering
- `renderListView(binders)` - Main render function
- `createListItem(binder)` - Creates single row HTML

### Utilities
- `escapeHtml(text)` - Prevents XSS
- `showToast(message, type)` - Toast notifications

### Interactions
- `openBinder(binderId)` - Navigate to binder
- `showRenameModal(binder)` - Rename binder
- `showDeleteModal(binder)` - Delete binder
- `showNewBinderModal()` - Create binder

## Testing Checklist

- [ ] Home page loads without errors
- [ ] Binders display in listview format
- [ ] All columns visible and properly aligned
- [ ] Status indicator colors correct
- [ ] Source badges display correctly
- [ ] Dates formatted properly
- [ ] Row click navigates to binder
- [ ] Action buttons work (open/rename/delete)
- [ ] Empty state shows when no binders
- [ ] Count updates after create/delete
- [ ] Responsive on different screen sizes
- [ ] Hover effects work smoothly
- [ ] Keyboard navigation works

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+

(CSS Grid and modern features required)
