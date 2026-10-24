import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, Shield, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export const Navbar: React.FC = () => {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">AutoElite</span>
              <span className="block text-xs text-slate-400 leading-none">Dealership</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg">
                  {user.role === 'ADMIN' ? (
                    <Shield className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                  <span className="text-sm text-slate-300">{user.fullName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${user.role === 'ADMIN' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 btn-secondary text-sm">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
