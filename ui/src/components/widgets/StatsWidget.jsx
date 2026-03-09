import React, { useState, useEffect } from 'react';

export const StatsWidget = ({ config }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // Simulate API call
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [config]);

  if (loading) {
    return <div className="text-gray-500">Loading stats...</div>;
  }

  return (
    <div className="bg-gradient-to-r from-purple-900 to-purple-800 p-4 rounded text-dark-text text-sm">
      <div className="font-semibold mb-2">{config.username}</div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div>
          <div className="text-lg font-bold">42</div>
          <div className="text-gray-300">Stars</div>
        </div>
        <div>
          <div className="text-lg font-bold">12</div>
          <div className="text-gray-300">Repos</div>
        </div>
        <div>
          <div className="text-lg font-bold">89</div>
          <div className="text-gray-300">Followers</div>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">Theme: {config.theme}</div>
    </div>
  );
};
