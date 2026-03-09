import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { API_ENDPOINTS, buildApiUrl } from '../../utils/apiConfig';
import { HeadingElement } from '../elements/HeadingElement';
import { TextElement } from '../elements/TextElement';
import { DividerElement } from '../elements/DividerElement';
import { ImageElement } from '../elements/ImageElement';
import { CodeBlockElement } from '../elements/CodeBlockElement';
import { ListElement } from '../elements/ListElement';

const ApiWidgetPreview = ({ widget }) => {
  const [loading, setLoading] = useState(true);
  const apiUrl = buildApiUrl(
    widget.type,
    widget.config,
    import.meta.env.VITE_API_BASE || 'https://octometrics.vercel.app'
  );

  return (
    <div>
      {loading && (
        <div className="text-xs text-gray-400 mb-2 animate-pulse">
          Loading preview...
        </div>
      )}
      <img
        src={apiUrl}
        alt={widget.type}
        style={{ pointerEvents: 'none' }}
        className={`h-auto max-w-full ${loading ? 'opacity-70' : 'opacity-100'} transition-opacity`}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  );
};

const MarkdownElementPreview = ({ widget }) => {
  switch (widget.type) {
    case 'heading':
      return <HeadingElement config={widget.config} />;
    case 'text':
      return <TextElement config={widget.config} />;
    case 'divider':
      return <DividerElement />;
    case 'image':
      return <ImageElement config={widget.config} />;
    case 'code':
      return <CodeBlockElement config={widget.config} />;
    case 'list':
      return <ListElement config={widget.config} />;
    default:
      return null;
  }
};

export const SortableWidget = ({ widget, isSelected, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isApiWidget = Boolean(API_ENDPOINTS[widget.type]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(widget.id);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(widget.id);
        }
      }}
      className={`widget-wrapper cursor-pointer transition-colors ${
        isSelected ? 'selected' : ''
      } ${isDragging ? 'opacity-70' : 'opacity-100'}`}
    >
      {isApiWidget ? (
        <ApiWidgetPreview widget={widget} />
      ) : (
        <MarkdownElementPreview widget={widget} />
      )}
    </div>
  );
};
