/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);

  const removePopup = useCallback((id) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  }, []);

  const addPopup = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setPopups(prev => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removePopup(id);
      }, duration);
    }
  }, [removePopup]);

  return (
    <PopupContext.Provider value={{ addPopup }}>
      {children}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {popups.map(popup => (
            <div key={popup.id} className="animate-fade-in glass-panel" 
                style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    minWidth: '300px',
                    borderLeft: `4px solid ${
                        popup.type === 'error' ? 'rgb(var(--danger))' : 
                        popup.type === 'success' ? 'rgb(var(--success))' : 
                        'rgb(var(--primary))'
                    }` 
                }}
            >
                {popup.type === 'error' && <AlertCircle size={20} color="rgb(var(--danger))" />}
                {popup.type === 'success' && <CheckCircle size={20} color="rgb(var(--success))" />}
                {popup.type === 'info' && <Info size={20} color="rgb(var(--primary))" />}
                <div style={{ flex: 1 }}>{popup.message}</div>
                <button onClick={() => removePopup(popup.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <X size={16} color="rgb(var(--text-muted))" />
                </button>
            </div>
        ))}
      </div>
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
