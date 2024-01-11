import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import Teams from './pages/Teams/Teams';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Users from './pages/Users/Users';
import Companies from './pages/Companies/Companies';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <NavBar />,
      id: 'root',
      children: [
        {
          path: '/',
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
        },
        {
          path: 'companies',
          element: <Companies />,
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

  return <RouterProvider router={router} />;
};

export default App;
