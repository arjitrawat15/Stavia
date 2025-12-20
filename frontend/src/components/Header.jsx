import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-slate-900">ReserveIT</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Home
              </Link>
              <Link to="/hotels" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Hotels
              </Link>
              <Link to="/restaurant" className="text-slate-700 hover:text-slate-900 font-medium transition-colors">
                Restaurant
              </Link>
              
              {/* Auth Section */}
              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.fullName}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link
                to="/"
                className="block text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/hotels"
                className="block text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hotels
              </Link>
              <Link
                to="/restaurant"
                className="block text-slate-700 hover:text-slate-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Restaurant
              </Link>
              
              {/* Mobile Auth */}
              {isAuthenticated() ? (
                <>
                  <div className="flex items-center space-x-2 text-slate-700 pt-2 border-t border-slate-200">
                    <User className="w-4 h-4" />
                    <span>{user?.fullName}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </nav>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;

