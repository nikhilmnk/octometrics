import React from 'react';

export const ListElement = ({ config }) => {
  const items = (config?.items || []).filter((item) => item && item.trim() !== '');

  if (items.length === 0) {
    return <p className="text-xs text-gray-500">Add one or more list items.</p>;
  }

  return (
    <ul className="list-disc pl-5 text-gray-300 space-y-1">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

