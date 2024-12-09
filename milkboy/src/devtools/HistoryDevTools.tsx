import React, { useState, useEffect } from 'react';
import { historyManager } from './HistoryManager';

const HistoryDevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [historyStack, setHistoryStack] = useState(historyManager.getCurrentStack());
  const [currentIndex, setCurrentIndex] = useState(historyManager.getCurrentIndex());

  useEffect(() => {
    const unsubscribe = historyManager.subscribe(() => {
      setHistoryStack(historyManager.getCurrentStack());
      setCurrentIndex(historyManager.getCurrentIndex());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEntryClick = (index: number) => {
    historyManager.navigate(index);
  };

  return (
    <div className="history-devtools">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
        }}
      >
        History DevTools
      </button>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '300px',
            maxHeight: '500px',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            overflow: 'auto',
          }}
        >
          {historyStack.map((entry, index) => (
            <div
              key={index}
              onClick={() => handleEntryClick(index)}
              style={{
                padding: '8px',
                cursor: 'pointer',
                backgroundColor: index === currentIndex ? '#e6e6e6' : 'transparent',
              }}
            >
              <div>{entry.pathname}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{new Date(entry.timestamp).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryDevTools;
