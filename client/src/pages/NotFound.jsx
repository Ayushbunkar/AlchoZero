import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-semibold text-accent-red mb-2">404 - Page Not Found</h1>
    <p className="text-gray-400 mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="px-4 py-2 rounded-lg bg-accent-yellow text-black text-sm">Go Home</Link>
  </div>
);

export default NotFound;
