import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { API_ENDPOINTS, buildApiUrl, getDefaultConfig } from '../../utils/apiConfig';

const createWidgetId = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `widget-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const useBuilderStore = create(
  devtools(
    (set, get) => ({
      widgets: [],
      selectedWidgetId: null,
      globalUsername: 'nikhilmnk', // Global username for all widgets

      setGlobalUsername: (username) => {
        set({ globalUsername: username });
        // Update all widgets that require username
        set((state) => ({
          widgets: state.widgets.map((widget) => {
            const endpoint = API_ENDPOINTS[widget.type];
            if (widget.type === 'badges') {
              return {
                ...widget,
                config: { ...widget.config, user: username }
              };
            }
            if (endpoint && endpoint.required.includes('username')) {
              return {
                ...widget,
                config: { ...widget.config, username }
              };
            }
            return widget;
          })
        }));
      },

      addWidget: (type) => {
        const id = createWidgetId();
        const config = getDefaultConfig(type);

        // Auto-populate username for API widgets
        const endpoint = API_ENDPOINTS[type];
        if (endpoint && endpoint.required.includes('username')) {
          config.username = get().globalUsername;
        }
        if (type === 'badges') {
          config.user = get().globalUsername;
        }

        const newWidget = {
          id,
          type,
          config,
        };
        set((state) => ({
          widgets: [...state.widgets, newWidget],
          selectedWidgetId: id,
        }));
        return id;
      },

      // insert at arbitrary index (used for drop at position)
      insertWidgetAtIndex: (type, index) => {
        const id = createWidgetId();
        const config = getDefaultConfig(type);
        const endpoint = API_ENDPOINTS[type];
        if (endpoint && endpoint.required.includes('username')) {
          config.username = get().globalUsername;
        }
        if (type === 'badges') {
          config.user = get().globalUsername;
        }
        const newWidget = { id, type, config };
        set((state) => {
          const ws = [...state.widgets];
          const targetIndex = Math.max(0, Math.min(index, ws.length));
          ws.splice(targetIndex, 0, newWidget);
          return { widgets: ws, selectedWidgetId: id };
        });
        return id;
      },

      removeWidget: (id) => {
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
          selectedWidgetId: null,
        }));
      },

      updateWidget: (id, config) => {
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, config: { ...w.config, ...config } } : w
          ),
        }));
      },

      selectWidget: (id) => {
        set({ selectedWidgetId: id });
      },

      reorderWidgets: (reorderedWidgets) => {
        set({ widgets: reorderedWidgets });
      },

      /**
       * Generate markdown from current widgets or markdown elements
       */
      getMarkdown: () => {
        const { widgets, globalUsername } = get();
        const baseUrl = window.location.origin;

        return widgets
          .map((widget) => {
            if (API_ENDPOINTS[widget.type]) {
              // API widget
              const endpoint = API_ENDPOINTS[widget.type];
              const config = { ...widget.config };
              if (endpoint.required.includes('username')) {
                config.username = globalUsername;
              }
              const url = buildApiUrl(widget.type, config, baseUrl);
              const title = endpoint.label || widget.type;
              const displayUrl = url.replace(/&/g, '\\&');
              return `![${title}](${displayUrl})`;
            }

            // Markdown element
            switch (widget.type) {
              case 'heading':
                return `${'#'.repeat(widget.config.level || 1)} ${widget.config.text || ''}`;
              case 'text':
                return widget.config.content || '';
              case 'divider':
                return '---';
              case 'image':
                return `![${widget.config.alt || ''}](${widget.config.url || ''})`;
              case 'code':
                return `\`\`\`${widget.config.language || ''}\n${widget.config.code || ''}\n\`\`\``;
              case 'list':
                return (widget.config.items || []).map((i) => `- ${i}`).join('\n');
              default:
                return '';
            }
          })
          .filter((line) => line)
          .join('\n\n');
      },

      clearAll: () => {
        set({ widgets: [], selectedWidgetId: null });
      },
    }),
    { name: 'builderStore' }
  )
);
