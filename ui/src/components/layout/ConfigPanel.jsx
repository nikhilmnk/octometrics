import React from 'react';
import { API_ENDPOINTS, MARKDOWN_ELEMENTS } from '../../utils/apiConfig';
import { useBuilderStore } from '../builder/builderStore';

const markdownFieldSchema = {
  heading: [
    { key: 'level', label: 'Level', type: 'number', min: 1, max: 6 },
    { key: 'text', label: 'Text', type: 'text' },
  ],
  text: [{ key: 'content', label: 'Content', type: 'textarea' }],
  divider: [],
  image: [
    { key: 'url', label: 'Image URL', type: 'text' },
    { key: 'alt', label: 'Alt Text', type: 'text' },
  ],
  code: [
    { key: 'language', label: 'Language', type: 'text' },
    { key: 'code', label: 'Code', type: 'textarea' },
  ],
  list: [{ key: 'items', label: 'List Items', type: 'list' }],
};

export const ConfigPanel = () => {
  const { widgets, selectedWidgetId, updateWidget, removeWidget } =
    useBuilderStore();
  const widget = widgets.find((entry) => entry.id === selectedWidgetId);

  if (!widget) {
    return (
      <div className="w-80 bg-dark-panel border-l border-dark-border p-6 flex items-center justify-center h-screen">
        <p className="text-center text-gray-500">Select an element to edit</p>
      </div>
    );
  }

  const endpoint = API_ENDPOINTS[widget.type];
  const markdownElement = MARKDOWN_ELEMENTS[widget.type];

  if (!endpoint && !markdownElement) {
    return (
      <div className="w-80 bg-dark-panel border-l border-dark-border p-6 flex items-center justify-center h-screen">
        <p className="text-center text-gray-500">Unknown element type</p>
      </div>
    );
  }

  const allFields = endpoint
    ? [
        ...endpoint.required
          .filter((key) => key !== 'username')
          .map((key) => ({
            key,
            label:
              key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
            type: 'text',
            required: true,
          })),
        ...endpoint.optional,
      ]
    : markdownFieldSchema[widget.type] || [];

  const handleChange = (key, value) => {
    updateWidget(selectedWidgetId, { [key]: value });
  };

  const renderField = (field) => {
    const value = widget.config?.[field.key];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value ?? ''}
            onChange={(event) => handleChange(field.key, event.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors"
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value ?? ''}
            min={field.min}
            max={field.max}
            onChange={(event) =>
              handleChange(field.key, Number(event.target.value) || '')
            }
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors"
          />
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(event) => handleChange(field.key, event.target.value)}
              className="px-2 py-1 bg-dark-bg border border-dark-border rounded cursor-pointer focus:outline-none focus:border-dark-accent transition-colors h-10 w-14"
            />
            <span className="text-xs text-gray-500 font-mono">{value}</span>
          </div>
        );

      case 'select':
        return (
          <select
            value={value ?? ''}
            onChange={(event) => handleChange(field.key, event.target.value)}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors"
          >
            <option value="">{`Select ${field.label.toLowerCase()}`}</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(event) =>
                handleChange(field.key, event.target.checked)
              }
              className="w-4 h-4 bg-dark-bg border border-dark-border rounded cursor-pointer accent-dark-accent"
            />
            <span className="text-sm text-gray-400">{field.label}</span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            value={value ?? ''}
            onChange={(event) => handleChange(field.key, event.target.value)}
            rows={5}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors resize-y"
          />
        );

      case 'list': {
        const listValue = Array.isArray(value) ? value.join('\n') : '';
        return (
          <textarea
            value={listValue}
            onChange={(event) =>
              handleChange(
                field.key,
                event.target.value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
              )
            }
            rows={6}
            className="px-3 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-dark-accent transition-colors resize-y"
          />
        );
      }

      default:
        return null;
    }
  };

  const title = endpoint?.label || markdownElement?.label || widget.type;
  const icon = endpoint?.icon || markdownElement?.icon || '';

  return (
    <div className="w-80 bg-dark-panel border-l border-dark-border flex flex-col h-auto overflow-y-auto">
      <div className="p-2 border-b border-dark-border sticky top-0 bg-dark-panel z-10">
        <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">Configure selected element</p>
      </div>

      <div className="p-4 flex flex-col gap-5 overflow-y-auto flex-1">
        {allFields.length === 0 && (
          <p className="text-xs text-gray-500">
            This element has no configurable fields.
          </p>
        )}

        {allFields.map((field) => (
          <div key={field.key} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-dark-text flex items-center gap-1">
              {field.label}
              {field.required && (
                <span className="text-xs text-red-400">*</span>
              )}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-dark-border bg-dark-bg">
        <button
          type="button"
          onClick={() => removeWidget(widget.id)}
          className="w-full px-3 py-2 rounded bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
        >
          Remove Widget
        </button>
      </div>
    </div>
  );
};
