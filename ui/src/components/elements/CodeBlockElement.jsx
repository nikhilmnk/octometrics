import React from 'react';

export const CodeBlockElement = ({ config }) => {
  return (
    <pre className="bg-[#0d1117] border border-dark-border rounded p-3 overflow-x-auto">
      <code className="text-sm text-gray-200 whitespace-pre-wrap">
        {config?.code || ''}
      </code>
    </pre>
  );
};
