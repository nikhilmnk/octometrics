export const API_BASE = import.meta.env.VITE_API_BASE;

export const MARKDOWN_ELEMENTS = {
  heading: {
    label: 'Heading',
    icon: '🔤',
    defaultConfig: { level: 1, text: '' },
  },
  text: {
    label: 'Text',
    icon: '✏️',
    defaultConfig: { content: '' },
  },
  divider: {
    label: 'Divider',
    icon: '―',
    defaultConfig: {},
  },
  image: {
    label: 'Image',
    icon: '🖼️',
    defaultConfig: { url: '', alt: '' },
  },
  code: {
    label: 'Code Block',
    icon: '💻',
    defaultConfig: { language: '', code: '' },
  },
  list: {
    label: 'List',
    icon: '📋',
    defaultConfig: { items: [''] },
  },
};

export const API_ENDPOINTS = {
  stats: {
    endpoint: '/api/stats',
    label: 'Stats Card',
    icon: '📊',
    required: ['username'],
    optional: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
    ],
  },
  languages: {
    endpoint: '/api/languages',
    label: 'Languages',
    icon: '💻',
    required: ['username'],
    optional: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
      {
        key: 'top',
        type: 'number',
        label: 'Number of Languages',
        min: 1,
        max: 20,
        default: 5,
      },
      {
        key: 'layout',
        type: 'select',
        label: 'Layout',
        options: ['bar', 'circle'],
        default: 'bar',
      },
      {
        key: 'view',
        type: 'select',
        label: 'View',
        options: ['top', 'all'],
        default: 'top',
      },
    ],
  },
  repos: {
    endpoint: '/api/repos',
    label: 'Repositories',
    icon: '📚',
    required: ['username'],
    optional: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
      {
        key: 'count',
        type: 'number',
        label: 'Number of Repos',
        min: 1,
        max: 20,
        default: 6,
      },
      {
        key: 'sort',
        type: 'select',
        label: 'Sort By',
        options: ['stars', 'forks', 'watchers', 'updated'],
        default: 'stars',
      },
    ],
  },
  banner: {
    endpoint: '/api/banner',
    label: 'Banner',
    icon: '🎨',
    required: ['name'],
    optional: [
      { key: 'title', type: 'text', label: 'Title' },
      { key: 'subtitle', type: 'text', label: 'Subtitle' },
      { key: 'tech', type: 'text', label: 'Tech Stack (comma-separated)' },
      { key: 'location', type: 'text', label: 'Location' },
      {
        key: 'pattern',
        type: 'select',
        label: 'Pattern',
        options: ['dots', 'grid', 'none'],
        default: 'dots',
      },
      {
        key: 'wave',
        type: 'checkbox',
        label: 'Show Wave Animation',
        default: true,
      },
      {
        key: 'align',
        type: 'select',
        label: 'Alignment',
        options: ['center', 'left'],
        default: 'center',
      },
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
    ],
  },
  typing: {
    endpoint: '/api/typing',
    label: 'Typing ',
    icon: '⌨️',
    required: ['lines'],
    optional: [
      {
        key: 'speed',
        type: 'number',
        label: 'Speed (chars/sec)',
        min: 1,
        max: 200,
        default: 80,
      },
      {
        key: 'pause',
        type: 'number',
        label: 'Pause Between Lines (ms)',
        min: 100,
        max: 5000,
        default: 1000,
      },
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
    ],
  },
  contributions: {
    endpoint: '/api/contributions',
    label: 'Contributions',
    icon: '🔥',
    required: ['username'],
    optional: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
      {
        key: 'year',
        type: 'number',
        label: 'Year',
        min: 2015,
        max: new Date().getFullYear(),
        default: new Date().getFullYear(),
      },
    ],
  },
  badges: {
    endpoint: '/api/badges/:type',
    label: 'Badge',
    icon: '🏅',
    pathParams: ['type'],
    required: [],
    optional: [
      {
        key: 'type',
        type: 'select',
        label: 'Badge Type',
        options: ['followers', 'stars', 'forks', 'watchers'],
        default: 'followers',
      },
      { key: 'repo', type: 'text', label: 'Repository (owner/repo)' },
    ],
  },
  dashboard: {
    endpoint: '/api/dashboard',
    label: 'Dashboard',
    icon: '📊',
    required: ['username'],
    optional: [
      {
        key: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['dark', 'light', 'tokyonight', 'dracula'],
        default: 'dark',
      },
      {
        key: 'layout',
        type: 'select',
        label: 'Layout',
        options: ['default', 'compact', 'wide'],
        default: 'default',
      },
    ],
  },
};

export function buildQuery(params) {
  return Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');
}

export function buildApiUrl(widgetType, config, baseUrl = API_BASE) {
  const endpoint = API_ENDPOINTS[widgetType];
  if (!endpoint) return '';

  const pathParamKeys = endpoint.pathParams || [];
  let path = endpoint.endpoint;
  const queryConfig = { ...config };

  if (widgetType === 'badges') {
    const badgeType = queryConfig.type || 'followers';
    if (badgeType === 'followers') {
      delete queryConfig.repo;
    } else {
      delete queryConfig.user;
    }
  }

  pathParamKeys.forEach((key) => {
    const rawValue = queryConfig[key];
    const value =
      rawValue === undefined || rawValue === null || rawValue === ''
        ? ''
        : encodeURIComponent(rawValue);
    path = path.replace(`:${key}`, value);
    delete queryConfig[key];
  });

  const query = buildQuery(queryConfig);
  return query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`;
}

export function generateMarkdownFromWidgets(
  widgets,
  baseUrl = import.meta.env.VITE_API_BASE
) {
  return widgets
    .map((widget) => {
      if (API_ENDPOINTS[widget.type]) {
        const endpoint = API_ENDPOINTS[widget.type];
        const url = buildApiUrl(widget.type, widget.config, baseUrl);
        const title =
          endpoint.label ||
          widget.type.charAt(0).toUpperCase() + widget.type.slice(1);
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
}

export function getDefaultConfig(widgetType) {
  // API widgets
  const endpoint = API_ENDPOINTS[widgetType];
  if (endpoint) {
    const config = {};
    // Add required fields with empty values (user will fill)
    endpoint.required.forEach((key) => {
      config[key] = '';
    });
    // Add optional fields with defaults
    endpoint.optional.forEach((param) => {
      config[param.key] = param.default !== undefined ? param.default : '';
    });

    // Custom defaults for specific required fields
    if (widgetType === 'typing' && config.lines === '') {
      config.lines = 'Hello World, I am a Full Stack Developer';
    }
    if (widgetType === 'banner' && config.name === '') {
      config.name = 'Nikhil';
    }

    return config;
  }

  // Markdown elements
  const element = MARKDOWN_ELEMENTS[widgetType];
  if (element) {
    return { ...element.defaultConfig };
  }

  return {};
}

export function getConfigSchema(widgetType) {
  const endpoint = API_ENDPOINTS[widgetType];
  if (!endpoint) return [];

  const schema = [];

  // Add required fields
  endpoint.required.forEach((key) => {
    if (key === 'user_or_repo') {
      // Skip for now, handled separately
      return;
    }
    schema.push({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      type: 'text',
      required: true,
    });
  });

  // Add optional fields
  schema.push(...endpoint.optional);

  return schema;
}
