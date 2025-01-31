import { Position } from '../types/common.type';

export const calculatePanelPosition = (panelPosition: Position) => {
  switch (panelPosition) {
    case 'bottom-right':
      return { bottom: '80px', right: '20px' };
    case 'bottom-left':
      return { bottom: '80px', left: '20px' };
    case 'top-right':
      return { top: '80px', right: '20px' };
    case 'top-left':
      return { top: '80px', left: '20px' };
  }
};

export const calculateButtonPosition = (buttonPosition: Position) => {
  switch (buttonPosition) {
    case 'bottom-right':
      return { bottom: '20px', right: '20px' };
    case 'bottom-left':
      return { bottom: '20px', left: '20px' };
    case 'top-right':
      return { top: '20px', right: '20px' };
    case 'top-left':
      return { top: '20px', left: '20px' };
  }
};
