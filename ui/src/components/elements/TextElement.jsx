import React from 'react';

export const TextElement = ({ config }) => {
  return <p className="text-gray-300 leading-relaxed">{config?.content || ''}</p>;
};

