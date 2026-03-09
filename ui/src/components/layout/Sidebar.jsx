import React from 'react';
import { API_ENDPOINTS, MARKDOWN_ELEMENTS } from '../../utils/apiConfig';

const WIDGET_TYPES = [
  'stats',
  'languages',
  'repos',
  'banner',
  'typing',
  'contributions',
  'badges',
];
const MARKDOWN_TYPES = ['heading', 'text', 'divider', 'image', 'code', 'list'];

const buildLibrary = (types, source) =>
  types
    .filter((type) => source[type])
    .map((type) => ({
      type,
      label: source[type].label,
      icon: source[type].icon,
    }));

export const Sidebar = ({ onAddWidget }) => {
  const widgetLibrary = buildLibrary(WIDGET_TYPES, API_ENDPOINTS);
  const markdownLibrary = buildLibrary(MARKDOWN_TYPES, MARKDOWN_ELEMENTS);

  const handleDragStart = (event, type) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/x-builder-element', type);
    event.dataTransfer.setData('text/plain', type);
  };

  const renderCard = (item) => (
    <button
      key={item.type}
      draggable
      type="button"
      onDragStart={(event) => handleDragStart(event, item.type)}
      onClick={() => onAddWidget(item.type)}
      className="w-1/2 text-left p-2  bg-dark-bg border border-dark-border rounded hover:border-dark-accent hover:bg-dark-border transition-all active:opacity-75 cursor-move"
    >
      <div className="flex items-center gap-1">
        <span className="text-xs">{item.icon}</span>
        <span className="text-xs text-dark-text font-medium">{item.label}</span>
      </div>
    </button>
  );

  return (
    <div className="w-64 bg-dark-panel border-r border-dark-border flex flex-col h-auto overflow-y-auto">
      <div className="p-2 border-b border-dark-border sticky top-0 bg-dark-panel z-10">
        <h2 className="text-lg font-bold text-dark-text">Components</h2>
      </div>

      <div className="p-4 space-y-3">
        <h3 className="text-xs uppercase tracking-wide  text-gray-400">
          Widgets
        </h3>
        {widgetLibrary.map(renderCard)}
      </div>

      <div className="p-4 space-y-3 border-t border-dark-border">
        <h3 className="text-xs uppercase tracking-wide text-gray-400">
          Markdown Elements
        </h3>
        {markdownLibrary.map(renderCard)}
      </div>
    </div>
  );
};
