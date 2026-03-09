import React from 'react';
import { API_ENDPOINTS } from '../../utils/apiConfig';

export const LeftSidebar = ({ onAddWidget }) => {
  // Convert API_ENDPOINTS to widget library
  const widgetLibrary = Object.entries(API_ENDPOINTS).map(([type, config]) => ({
    id: type,
    type,
    label: config.label,
    icon: config.icon,
  }));

  // markdown elements library
  const elementLibrary = [
    { id: 'heading', type: 'heading', label: 'Heading', icon: '🔤' },
    { id: 'text', type: 'text', label: 'Text', icon: '✏️' },
    { id: 'divider', type: 'divider', label: 'Divider', icon: '―' },
    { id: 'image', type: 'image', label: 'Image', icon: '🖼️' },
    { id: 'code', type: 'code', label: 'Code Block', icon: '💻' },
    { id: 'list', type: 'list', label: 'List', icon: '📋' },
  ];

  const handleDragStart = (e, widget) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('widgetType', JSON.stringify(widget));
  };

  return (
    <div className="w-64 bg-dark-panel border-r border-dark-border flex flex-col h-auto overflow-y-auto">
      {/* Header */}
      <div className="p-2 border-b border-dark-border sticky top-0 bg-dark-panel z-10">
        <h2 className="text-lg font-bold text-dark-text">📦 Components</h2>
        <p className="text-xs text-gray-500 mt-1">{widgetLibrary.length} widgets available</p>
      </div>

      {/* API Widgets Section */}
      <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Widgets</h3>
        {widgetLibrary.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, widget)}
            onClick={() => onAddWidget(widget.type)}
            className="p-3 bg-dark-bg border border-dark-border rounded cursor-move hover:border-dark-accent hover:bg-dark-border transition-all group active:opacity-75"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{widget.icon}</span>
              <span className="font-medium text-dark-text text-sm group-hover:text-dark-accent transition-colors">
                {widget.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 ml-7">📌 drag • 🖱️ click</p>
          </div>
        ))}
      </div>

      {/* Markdown Elements Section */}
      <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">Markdown Elements</h3>
        {elementLibrary.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => handleDragStart(e, widget)}
            onClick={() => onAddWidget(widget.type)}
            className="p-3 bg-dark-bg border border-dark-border rounded cursor-move hover:border-dark-accent hover:bg-dark-border transition-all group active:opacity-75"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{widget.icon}</span>
              <span className="font-medium text-dark-text text-sm group-hover:text-dark-accent transition-colors">
                {widget.label}
              </span>
            </div>
            <p className="text-xs text-gray-600 ml-7">📌 drag • 🖱️ click</p>
          </div>
        ))}
      </div>
    </div>
  );
};
