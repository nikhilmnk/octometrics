import React, { createContext, useContext } from 'react';
const DragContext = createContext();

export const DragProvider = ({ children }) => {
  return <DragContext.Provider value={{}}>{children}</DragContext.Provider>;
};

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error('useDragContext must be used within DragProvider');
  }
  return context;
};
