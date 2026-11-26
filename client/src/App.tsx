import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/NavBar';
import Auth from './pages/Auth';
import Companies from './pages/Companies';
import Experience from './pages/Experience';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Students from './pages/Students';
import Teams from './pages/Teams';

const Stats = lazy(() => import('./pages/Stats'));

const App = () => (
	<BrowserRouter>
		<Routes>
			<Route element={<NavBar />}>
				<Route path="/" element={<Home />} />
				<Route
					path="/stats"
					element={
						<Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--dim)' }}>Loading...</div>}>
							<Stats />
						</Suspense>
					}
				/>
				<Route path="/teams" element={<Teams />} />
				<Route path="/students" element={<Students />} />
				<Route path="/companies" element={<Companies />} />
				<Route path="/experience" element={<Experience />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
		<ToastContainer position="bottom-right" autoClose={2500} theme="dark" newestOnTop closeOnClick />
	</BrowserRouter>
);

export default App;
