import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Shield,
  User,
  Sun,
  Moon,
  MapPin,
  ChevronDown,
  Search,
  Globe,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import toast from 'react-hot-toast';

const CITIES = [
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
];

interface NavbarProps {
  onSearch?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(navSearch);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070b12] text-white border-b border-zinc-800/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Logo & Navigation Links */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              {/* CarWale Brandmark Hexagon/Brackets */}
              <div className="relative flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 28 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="24" height="20" rx="4" />
                  <path d="M7 14h14" />
                  <circle cx="8" cy="18" r="1.5" fill="currentColor" />
                  <circle cx="20" cy="18" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                car<span className="text-red-500">wale</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[12px] font-bold uppercase tracking-wider text-zinc-300">
              <Link
                to="/"
                className="hover:text-red-400 transition-colors py-1 border-b-2 border-red-500 text-white font-extrabold"
              >
                NEW CARS
              </Link>
              <Link
                to="/"
                className="hover:text-red-400 transition-colors py-1 border-b-2 border-transparent text-zinc-400 hover:text-white"
              >
                USED CARS
              </Link>
              <Link
                to="/"
                className="hover:text-red-400 transition-colors py-1 border-b-2 border-transparent text-zinc-400 hover:text-white"
              >
                REVIEWS & NEWS
              </Link>
            </nav>
          </div>

          {/* Right Header: Search Bar + Icons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end max-w-xl">
            {/* Top Navbar Search Capsule */}
            <form
              onSubmit={handleNavSearchSubmit}
              className="relative hidden sm:block w-44 md:w-60 lg:w-72"
            >
              <input
                type="text"
                value={navSearch}
                onChange={(e) => {
                  setNavSearch(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                placeholder="Search"
                className="w-full bg-[#111927] border border-zinc-700/80 rounded-full px-4 py-1.5 pr-9 text-xs text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-all"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Theme Toggle (Sun / Moon) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-300" />
              )}
            </button>

            {/* City Selector Pin */}
            <div className="relative">
              <button
                onClick={() => setShowCityDropdown((prev) => !prev)}
                aria-label="Select City"
                className="flex items-center gap-1 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
                title={`City: ${selectedCity}`}
              >
                <MapPin className="w-4 h-4 text-zinc-300" />
              </button>

              {showCityDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#111927] border border-zinc-700 rounded-xl shadow-2xl py-2 z-50">
                  <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Select Your City
                  </p>
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-zinc-800 transition-colors ${
                        selectedCity === city
                          ? 'text-teal-400 font-bold bg-zinc-800/50'
                          : 'text-zinc-300'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language / Locale Icon [A/文] */}
            <button
              aria-label="Language selection"
              className="hidden sm:flex items-center gap-1 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title="Language: English"
            >
              <Globe className="w-4 h-4 text-zinc-300" />
            </button>

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111927] rounded-full border border-zinc-800">
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-teal-400" />
                  )}
                  <span className="text-xs font-semibold text-zinc-200">{user.fullName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-[#111927] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-all"
                  title="Sign In / Account"
                >
                  <User className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="hidden md:inline-flex px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-full transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
