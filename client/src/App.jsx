import { Routes, Route, BrowserRouter, useInRouterContext } from 'react-router-dom';
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
import Profile from './pages/Profile';
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
import DriverDetails from './pages/DriverDetails';
import { AuthProvider } from './contexts/AuthContext';
import { DetectionProvider } from './contexts/DetectionContext';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SearchProvider } from './contexts/SearchContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleGuard from './components/common/RoleGuard';
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

// Wrap children with BrowserRouter only if not already inside a router context
const MaybeRouter = ({ children }) => {
	const inCtx = useInRouterContext();
	return inCtx ? children : <BrowserRouter>{children}</BrowserRouter>;
};

const App = () => {
	const location = useLocation();
	const pathname = location.pathname || '';
	const consoleRoutes = ['/dashboard', '/devices', '/events', '/users', '/analytics', '/settings'];
	const showConsoleUI = consoleRoutes.some((x) => pathname.startsWith(x));
	return (
			<MaybeRouter>
			<SearchProvider>
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
												<Route path="/devices" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin"]}><DeviceManagement /></RoleGuard></ProtectedRoute>} />
												<Route path="/events" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin","driver"]}><EventLog /></RoleGuard></ProtectedRoute>} />
												<Route path="/users" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin"]}><Users /></RoleGuard></ProtectedRoute>} />
												<Route path="/analytics" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin"]}><Analytics /></RoleGuard></ProtectedRoute>} />
												<Route path="/analytics/device/:deviceId" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin"]}><AnalyticsDevice /></RoleGuard></ProtectedRoute>} />
												<Route path="/settings" element={<ProtectedRoute><RoleGuard roles={["admin","superadmin"]}><Settings /></RoleGuard></ProtectedRoute>} />
												<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
						                                                <Route path="/driver/:id" element={<ProtectedRoute><DriverDetails /></ProtectedRoute>} />
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
								</SearchProvider>
			</MaybeRouter>
	);
};

export default App;

// Portal that mounts mobile sidebar and exposes control via context
const MobileSidebarPortal = () => {
	const { open, setOpen } = useMobileSidebar();
	return <RoleSidebarMobile open={open} onClose={() => setOpen(false)} />;
};

