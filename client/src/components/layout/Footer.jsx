import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full mt-8 text-center text-xs text-gray-500 py-6 border-t border-white/10">
      <div className="flex justify-center gap-3 mb-2">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>•</span>
        <Link to="/about" className="hover:text-white">About</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-white">Contact</Link>
      </div>
      <div>&copy; {new Date().getFullYear()} AlchoZero – Drunk Driving Detection (Frontend Prototype)</div>
    </footer>
  );
};

export default Footer;
