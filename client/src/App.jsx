import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import Teams from './pages/Teams/Teams';
import Users from './pages/Users/Users';
import Companies from './pages/Companies/Companies';
import Authentication from './pages/Auth/Authentication';
import { checkAuthAction, getAuthToken } from './utils/auth';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <NavBar />,
      id: 'root',
      loader: getAuthToken,
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
          path: 'users',
          element: <Users />,
          loader: checkAuthAction,
        },
        {
          path: 'companies',
          element: <Companies />,
          loader: checkAuthAction,
        },
        {
          path: 'auth',
          element: <Authentication />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
