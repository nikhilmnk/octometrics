import React from 'react';
import { useBuilderStore } from './components/builder/builderStore';
import { Sidebar } from './components/layout/Sidebar';
import { Canvas } from './components/layout/Canvas';
import { ConfigPanel } from './components/layout/ConfigPanel';
import './styles.css';

export default function App() {
  const {
    widgets,
    selectedWidgetId,
    globalUsername,
    setGlobalUsername,
    addWidget,
    insertWidgetAtIndex,
    selectWidget,
    reorderWidgets,
  } = useBuilderStore();

  return (
    <div className="h-screen bg-dark-bg text-dark-text flex flex-col">
      {/* HEADER - GitHub Username Input */}
      <header className="bg-dark-panel border-b border-dark-border px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-dark-text whitespace-nowrap">
              GitHub Username:
            </label>
            <input
              type="text"
              value={globalUsername}
              onChange={(e) => setGlobalUsername(e.target.value)}
              placeholder="octocat"
              className="flex-1 max-w-xs px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors"
            />
            <div className="text-xs text-gray-500">
              This username will be used for all widgets that require it
            </div>
          </div>
        </div>
      </header>

      {/* MAIN GRID - Left sidebar, Center canvas, Right panel */}
      <div className="flex flex-1 overflow-hidden h-94">
        <Sidebar onAddWidget={addWidget} />

        <div className="flex flex-1">
          <Canvas
            widgets={widgets}
            selectedWidgetId={selectedWidgetId}
            onSelectWidget={selectWidget}
            onReorderWidgets={reorderWidgets}
            onInsertWidgetAtIndex={insertWidgetAtIndex}
          />

          <ConfigPanel />
        </div>
      </div>
    </div>
  );
}
