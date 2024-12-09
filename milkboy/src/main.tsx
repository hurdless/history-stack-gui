import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import HistoryDevTools from './devtools/HistoryDevTools.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HistoryDevTools />
    <RouterProvider router={router} />
  </StrictMode>,
);
