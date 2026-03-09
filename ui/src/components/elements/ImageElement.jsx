import React from 'react';

export const ImageElement = ({ config }) => {
  if (!config?.url) {
    return (
      <p className="text-xs text-gray-500">
        Set an image URL in the config panel.
      </p>
    );
  }

  return (
    <img
      src={config.url}
      alt={config.alt || 'README image'}
      className="max-w-full h-auto rounded"
    />
  );
};
