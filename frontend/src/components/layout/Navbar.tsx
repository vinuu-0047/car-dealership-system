import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, Shield, User, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-40 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:bg-amber-500 transition-colors">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
                Auto<span className="text-amber-600 dark:text-amber-500">Elite</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400">
                Indian Fleet
              </span>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-zinc-700" />
              )}
            </button>

            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  )}
                  <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{user.fullName}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      user.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                        : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 btn-secondary text-sm py-2 px-3">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-3.5">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-3.5">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
