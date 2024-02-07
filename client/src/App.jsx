import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar/NavBar';
import Authentication from './pages/Auth/Authentication';
import Companies from './pages/Companies/Companies';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Stats from './pages/Stats/Stats';
import Students from './pages/Students/Students';
import Teams from './pages/Teams/Teams';
import Experience from './pages/Experience/Experience';
import { checkAuthAction, getAuthToken } from './utils/auth';

const App = () => {
	const router = createBrowserRouter([
		{
			path: '/',
			element: (
				<>
					<NavBar />
					<ToastContainer
						position="bottom-right"
						autoClose={2500}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable
						pauseOnHover
					/>
				</>
			),
			id: 'root',
			loader: getAuthToken,
			children: [
				{
					index: true,
					element: <Home />
				},
				{
					path: 'stats',
					element: <Stats />
				},
				{
					path: 'teams',
					element: <Teams />
				},
				{
					path: 'students',
					element: <Students />,
					loader: checkAuthAction
				},
				{
					path: 'companies',
					element: <Companies />,
					loader: checkAuthAction
				},
				{
					path: 'experience',
					element: <Experience />,
					loader: checkAuthAction
				},
				{
					path: 'profile',
					element: <Profile />,
					loader: checkAuthAction
				},
				{
					path: 'auth',
					element: <Authentication />
				}
			]
		}
	]);

	return <RouterProvider router={router} className="App" />;
};

export default App;
