import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import Teams from './pages/Teams/Teams';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <NavBar />,
    id: 'root',
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'stats',
        element: <Stats />,
      },
      {
        path: 'teams',
        element: <Teams />,
      },
      {
        path: 'auth',
        children: [
          {
            path: 'signin',
            element: <SignIn />,
          },
          {
            path: 'signup',
            element: <SignUp />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
