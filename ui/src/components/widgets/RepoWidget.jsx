import React from 'react';

export const RepoWidget = ({ config }) => {
  const repos = ['repo1', 'repo2', 'repo3'];

  return (
    <div className="bg-gradient-to-r from-orange-900 to-orange-800 p-4 rounded text-dark-text text-sm">
      <div className="font-semibold mb-2">{config.username} - Repositories</div>
      <div className="space-y-1">
        {repos.map((repo) => (
          <div key={repo} className="flex justify-between items-center text-xs">
            <span className="font-mono">{repo}</span>
            <span className="text-yellow-300">⭐ 42</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-2">Sort by: {config.sort}</div>
    </div>
  );
};
