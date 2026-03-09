import React from 'react';

export const BannerWidget = ({ config }) => {
  return (
    <div className="bg-gradient-to-r from-pink-900 to-pink-800 p-6 rounded text-dark-text text-sm">
      <div className="font-bold text-lg mb-1">Welcome, {config.username}!</div>
      <div className="text-xs text-gray-400">Banner Theme: {config.theme}</div>
    </div>
  );
};
