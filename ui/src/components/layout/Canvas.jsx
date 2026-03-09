import React, { useMemo, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { generateMarkdownFromWidgets } from '../../utils/apiConfig';
import { SortableWidget } from './SortableWidget';

const extractDroppedType = (event) => {
  const directType = event.dataTransfer.getData(
    'application/x-builder-element'
  );
  if (directType) return directType;

  const plainType = event.dataTransfer.getData('text/plain');
  if (plainType) return plainType;

  const legacy = event.dataTransfer.getData('widgetType');
  if (!legacy) return '';

  try {
    const parsed = JSON.parse(legacy);
    return parsed?.type || '';
  } catch {
    return '';
  }
};

const DropZone = ({ active, onDragOver, onDrop }) => (
  <div
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={`h-2 rounded transition-colors ${active ? 'bg-dark-accent' : 'bg-transparent'}`}
  />
);

export const Canvas = ({
  widgets,
  selectedWidgetId,
  onSelectWidget,
  onReorderWidgets,
  onInsertWidgetAtIndex,
}) => {
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [dropIndex, setDropIndex] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );
  const sortableIds = useMemo(
    () => widgets.map((widget) => widget.id),
    [widgets]
  );
  const markdown = useMemo(
    () => generateMarkdownFromWidgets(widgets, import.meta.env.VITE_API_BASE),
    [widgets]
  );

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handleSortStart = ({ active }) => {
    onSelectWidget(active.id);
  };

  const handleSortEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = widgets.findIndex((widget) => widget.id === active.id);
    const newIndex = widgets.findIndex((widget) => widget.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorderWidgets(arrayMove(widgets, oldIndex, newIndex));
  };

  const handleExternalDragOver = (event, index) => {
    const type = extractDroppedType(event);
    if (!type) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    setDropIndex(index);
  };

  const handleExternalDrop = (event, index) => {
    const type = extractDroppedType(event);
    if (!type) return;
    event.preventDefault();
    onInsertWidgetAtIndex(type, index);
    setDropIndex(null);
  };

  return (
    <div
      className="flex-1 bg-dark-bg border-r border-dark-border flex flex-col overflow-y-auto"
      onClick={() => onSelectWidget(null)}
    >
      <div className="sticky top-0 bg-dark-panel border-b border-dark-border px-8 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-dark-text">
            {isCodeMode ? 'Code' : 'Preview'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isCodeMode}
              onChange={(event) => setIsCodeMode(event.target.checked)}
            />
            <div className="w-11 h-6 bg-dark-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-accent/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent" />
          </label>
        </div>

        {widgets.length > 0 && (
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-dark-accent hover:bg-blue-600 text-dark-bg rounded transition-colors text-sm font-medium"
            title="Copy markdown to clipboard"
          >
            Copy
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {widgets.length === 0 ? (
            <div
              className="flex items-center justify-center h-96 border border-dashed border-dark-border rounded"
              onDragOver={(event) => handleExternalDragOver(event, 0)}
              onDrop={(event) => handleExternalDrop(event, 0)}
            >
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">
                  Drag components from the left panel to build your README
                </p>
                <p className="text-xs text-gray-600">
                  Click components to add them at the end
                </p>
              </div>
            </div>
          ) : !isCodeMode ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleSortStart}
              onDragEnd={handleSortEnd}
            >
              <SortableContext
                items={sortableIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1 max-w-2xl mx-auto">
                  <DropZone
                    active={dropIndex === 0}
                    onDragOver={(event) => handleExternalDragOver(event, 0)}
                    onDrop={(event) => handleExternalDrop(event, 0)}
                  />

                  {widgets.map((widget, index) => (
                    <React.Fragment key={widget.id}>
                      <SortableWidget
                        widget={widget}
                        isSelected={widget.id === selectedWidgetId}
                        onSelect={onSelectWidget}
                      />
                      <DropZone
                        active={dropIndex === index + 1}
                        onDragOver={(event) =>
                          handleExternalDragOver(event, index + 1)
                        }
                        onDrop={(event) => handleExternalDrop(event, index + 1)}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-[#0d1117] border border-gray-800 rounded-lg">
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-800 text-xs text-gray-400">
                  markdown
                  <button
                    onClick={handleCopyMarkdown}
                    className="hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={markdown}
                  readOnly
                  className="w-full h-80 bg-transparent p-4 font-mono text-sm text-gray-200 outline-none resize-none"
                  placeholder="No widgets added yet"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
