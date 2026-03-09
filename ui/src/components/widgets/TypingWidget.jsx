import React from 'react';

export const TypingWidget = ({ config }) => {
  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded text-dark-text text-sm">
      <div className="font-mono text-lg font-bold mb-2">{config.text}_</div>
      <div className="text-xs text-gray-400">Speed: {config.speed}ms | Font: {config.font}</div>
      <div className="text-xs mt-2 flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: config.color }}
        ></div>
        <span>Color: {config.color}</span>
      </div>
    </div>
  );
};
