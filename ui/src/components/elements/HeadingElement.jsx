import React from 'react';

export const HeadingElement = ({ config }) => {
  const level = Math.min(6, Math.max(1, Number(config?.level) || 1));
  const text = config?.text || 'Untitled heading';
  const Tag = `h${level}`;

  return <Tag className="text-dark-text font-bold">{text}</Tag>;
};
