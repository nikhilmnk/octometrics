# GitHub README Builder UI - Setup & Installation

## Quick Start

### Prerequisites

- Node.js 16+ and npm installed

### Installation

```bash
cd ui
npm install
npm run dev
```

The UI will automatically open at `http://localhost:5173`

## Features

### 3-Panel Layout

**LEFT PANEL - Component Library**

- Displays 7 draggable widget types
- Click or drag widgets to add to canvas
- Each widget has custom configuration options

**CENTER PANEL - Canvas**

- Drop zone for widgets
- Drag to reorder
- Click to select widget
- Right-click context menu to delete

**RIGHT PANEL - Configuration**

- Real-time configuration for selected widget
- Theme, color, text, and other options
- Changes reflect instantly in preview

### Widget Types

1. **Stats Card** - GitHub user statistics with themes
2. **Languages** - Programming language breakdown
3. **Repositories** - Top repositories showcase
4. **Typing Animation** - Animated text display
5. **Banner** - Customizable welcome banner
6. **Badges** - GitHub badges
7. **Contributions** - Contribution graph

### Drag & Drop

- Drag widgets from left sidebar
- Drop into canvas area
- Reorder by dragging within canvas
- Uses `@dnd-kit` for smooth interactions

### Export Features

Bottom-right floating action bar:

- **Copy Markdown** - Copy widget markdown to clipboard
- **Export Markdown** - Download as `.md` file
- **Clear All** - Remove all widgets

## Project Structure

```
ui/
├── index.html                    # Entry HTML
├── package.json                  # Dependencies
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind theme
├── postcss.config.js            # PostCSS configuration
├── src/
│   ├── main.jsx                 # React entry point
│   ├── App.jsx                  # Main component
│   ├── styles.css               # Global styles
│   └── components/
│       ├── builder/
│       │   └── builderStore.js  # Zustand state management
│       ├── layout/
│       │   ├── LeftSidebar.jsx  # Component library
│       │   ├── Canvas.jsx       # Widget canvas
│       │   └── ConfigPanel.jsx  # Configuration panel
│       ├── dragdrop/
│       │   └── DragProvider.jsx # Drag & drop context
│       └── widgets/
│           ├── StatsWidget.jsx
│           ├── TypingWidget.jsx
│           ├── LanguageWidget.jsx
│           ├── RepoWidget.jsx
│           └── BannerWidget.jsx
```

## Configuration Options

### Stats Widget

- Username (text)
- Theme (dark, light, dracula, tokyonight)
- Hide Border (boolean)
- Hide Rank (boolean)
- Hide Title (boolean)

### Typing Widget

- Text (text)
- Font (monospace, sans-serif, serif)
- Color (color picker)
- Speed (50-500ms)

### Languages Widget

- Username (text)
- Layout (compact, donut, donut-vertical)
- Hide Progress (boolean)

### Repository Widget

- Username (text)
- Sort By (stars, forks, updated)
- Hide Stars (boolean)

### Banner Widget

- Username (text)
- Theme (dark, light, dracula, tokyonight)

### Badges Widget

- Username (text)
- Style (flat, flat-square, plastic)

### Contributions Widget

- Username (text)
- Year (2000-current year)

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **dnd-kit** - Drag and drop
- **PostCSS** - CSS processing

## API Integration

The builder connects to existing backend APIs (no code changes needed):

```
GET /api/stats?username=USER&theme=dark
GET /api/languages?username=USER
GET /api/repositories?username=USER
GET /api/typing?text=HELLO
GET /api/banner?username=USER
GET /api/badges?username=USER
GET /api/contributions?username=USER
```

The proxy in `vite.config.js` forwards requests to `http://localhost:3000`

## Color Scheme

Dark developer theme colors:

- Background: `#0d1117`
- Panel: `#161b22`
- Accent: `#58a6ff`
- Border: `#30363d`
- Text: `#c9d1d9`

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview
```

## Next Steps

1. Backend server should be running on port 3000
2. Open the UI builder at http://localhost:5173
3. Add widgets from left panel
4. Configure each widget in right panel
5. Export markdown or copy to clipboard

## Notes

- All widget previews are placeholder designs
- Real API integration will pull live GitHub data
- State persists in localStorage via Zustand devtools
- Markdown export format: `![widget-type](api-url?params)`
