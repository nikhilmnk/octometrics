import React from 'react';

export const LanguageWidget = ({ config }) => {
  const languages = ['JavaScript', 'Python', 'TypeScript', 'React', 'Node.js'];

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4 rounded text-dark-text text-sm">
      <div className="font-semibold mb-2">{config.username} - Languages</div>
      <div className="space-y-1">
        {languages.map((lang, i) => (
          <div key={lang} className="flex justify-between text-xs">
            <span>{lang}</span>
            <span className="text-gray-300">{15 + i * 5}%</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-2">Layout: {config.layout}</div>
    </div>
  );
};
