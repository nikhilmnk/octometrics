import React from 'react';

export const BasePreviewCard = ({ children }) => (
  <div className="rounded-xl border border-dark-border bg-dark-panel p-4">
    <div className="rounded-lg bg-dark-bg p-3">{children}</div>
  </div>
);
