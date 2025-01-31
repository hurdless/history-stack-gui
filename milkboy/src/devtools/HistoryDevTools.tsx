import React, { useState, useEffect } from 'react';
import { historyManager } from './HistoryManager';
import { Position } from '../types/common.type';
import { calculatePanelPosition } from '../utils/caculatePosition';
import { calculateButtonPosition } from '../utils/caculatePosition';

interface DevToolsProps {
  initialIsOpen?: boolean;
  panelPosition?: Position;
  buttonPosition?: Position;
}

const HistoryDevTools: React.FC<DevToolsProps> = ({
  initialIsOpen = false,
  panelPosition = 'bottom-right',
  buttonPosition = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
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
          zIndex: 9999,
          ...calculateButtonPosition(buttonPosition),
        }}
      >
        History DevTools
      </button>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            width: '300px',
            maxHeight: '500px',
            backgroundColor: 'white',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            overflow: 'auto',
            ...calculatePanelPosition(panelPosition),
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
