import React, { useState } from 'react';


const HistoryDevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="history-devtools">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999
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
            backgroundColor: 'lightgreen',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            zIndex: 9999,
            overflow: 'auto'
          }}
        >
          Hello History DevTools
        </div>
      )}
    </div>
  );
};

export default HistoryDevTools;