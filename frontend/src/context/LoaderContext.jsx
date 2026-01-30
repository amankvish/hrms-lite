/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () => setLoadingCount(c => c + 1);
  const hideLoader = () => setLoadingCount(c => Math.max(0, c - 1));

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loadingCount > 0 && (
          <div style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(2px)', zIndex: 9999, display: 'flex', 
              alignItems: 'center', justifyContent: 'center'
          }}>
              <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }}></div>
          </div>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
