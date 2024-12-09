import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Test1 from './example/Test1';
import Test2 from './example/Test2';
import Test3 from './example/Test3';
import Test4 from './example/Test4';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/test1',
    element: <Test1 />,
  },
  {
    path: '/test2',
    element: <Test2 />,
  },
  {
    path: '/test3',
    element: <Test3 />,
  },
  {
    path: '/test4',
    element: <Test4 />,
  },
]);
