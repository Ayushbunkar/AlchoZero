import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import RoleSidebar from './components/layout/RoleSidebar';
import RoleSidebarMobile from './components/layout/RoleSidebarMobile';
import ConsoleSidebarTrigger from './components/layout/ConsoleSidebarTrigger';
import { MobileSidebarProvider, useMobileSidebar } from './contexts/MobileSidebarContext';
import Footer from './components/layout/Footer';
import RoleDashboard from './pages/RoleDashboard';
import DeviceManagement from './pages/DeviceManagement';
import EventLog from './pages/EventLog';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import AnalyticsDevice from './pages/AnalyticsDevice';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
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
		<AnimatePresence mode="sync" initial={false}>
			<motion.div
				key={location.pathname}
				initial={false}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 0 }}
				transition={{ duration: 0.15 }}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};

const App = () => {
	const location = useLocation();
	const pathname = location.pathname || '';
	const consoleRoutes = ['/dashboard', '/devices', '/events', '/users', '/analytics', '/settings'];
	const showConsoleUI = consoleRoutes.some((x) => pathname.startsWith(x));
	return (
		<AuthProvider>
			<DetectionProvider>
				<ThemeProvider>
					<ToastProvider>
						<MobileSidebarProvider>
							<div className="min-h-screen bg-bg text-white flex flex-col">
								<Navbar />
								<div className="flex flex-1">
									{/* Sidebar on dashboard routes only */}
									{showConsoleUI ? <RoleSidebar /> : null}
									{showConsoleUI ? <MobileSidebarPortal /> : null}
									{showConsoleUI ? <ConsoleSidebarTrigger /> : null}
									<main className="flex-1">
										<RouteWrapper>
											<Routes>
												<Route path="/" element={<Home />} />
												<Route path="/about" element={<About />} />
												<Route path="/services" element={<Services />} />
												<Route path="/contact" element={<Contact />} />
												<Route path="/login" element={<Login />} />
												<Route path="/register" element={<Register />} />
												<Route path="/reset-password" element={<ResetPassword />} />
												<Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
												<Route path="/devices" element={<ProtectedRoute><DeviceManagement /></ProtectedRoute>} />
												<Route path="/events" element={<ProtectedRoute><EventLog /></ProtectedRoute>} />
												<Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
												<Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
												<Route path="/analytics/device/:deviceId" element={<ProtectedRoute><AnalyticsDevice /></ProtectedRoute>} />
												<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
												<Route path="*" element={<NotFound />} />
											</Routes>
										</RouteWrapper>
									</main>
								</div>
								<Footer />
							</div>
						</MobileSidebarProvider>
					</ToastProvider>
				</ThemeProvider>
			</DetectionProvider>
		</AuthProvider>
	);
};

export default App;

// Portal that mounts mobile sidebar and exposes control via context
const MobileSidebarPortal = () => {
	const { open, setOpen } = useMobileSidebar();
	return <RoleSidebarMobile open={open} onClose={() => setOpen(false)} />;
};

