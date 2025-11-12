import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import DeviceManagement from './pages/DeviceManagement';
import EventLog from './pages/EventLog';
import Settings from './pages/Settings';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { DetectionProvider } from './contexts/DetectionContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './pages/NotFound';
import { AnimatePresence, motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useLocation } from 'react-router-dom';

const RouteWrapper = ({ children }) => {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

const App = () => {
	return (
			<AuthProvider>
				<DetectionProvider>
					<ThemeProvider>
					<ToastProvider>
					<BrowserRouter>
						<div className="min-h-screen bg-bg text-white flex flex-col">
							<Navbar />
							<div className="flex flex-1">
								{/* Sidebar only on dashboard */}
								{location.pathname.startsWith('/dashboard') ? <Sidebar /> : null}
								<main className="flex-1">
									<RouteWrapper>
										<Routes>
											<Route path="/" element={<Home />} />
											<Route path="/about" element={<About />} />
											<Route path="/contact" element={<Contact />} />
											<Route path="/login" element={<Login />} />
											<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
											<Route path="/devices" element={<ProtectedRoute><DeviceManagement /></ProtectedRoute>} />
											<Route path="/events" element={<ProtectedRoute><EventLog /></ProtectedRoute>} />
											<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
											<Route path="*" element={<NotFound />} />
										</Routes>
									</RouteWrapper>
								</main>
							</div>
							<Footer />
						</div>
							</BrowserRouter>
							</ToastProvider>
							</ThemeProvider>
			</DetectionProvider>
		</AuthProvider>
	);
};

export default App;

