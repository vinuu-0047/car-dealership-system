import React from 'react';
import { Link } from 'react-router-dom';
import { X, Lock, ShoppingBag, ArrowRight, UserPlus } from 'lucide-react';
import { Vehicle } from '../../types';
import { formatPrice } from '../../lib/utils';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

export const AuthPromptModal: React.FC<Props> = ({ vehicle, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="card w-full max-w-md overflow-hidden p-0 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Sign In Required</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Preview Card */}
        <div className="p-5">
          <div className="flex gap-4 p-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl mb-5 border border-zinc-200 dark:border-zinc-700/60 items-center">
            {vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-2xl">
                🚗
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm truncate">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{vehicle.category}</p>
              <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                {formatPrice(vehicle.price)}
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6 text-center leading-relaxed">
            Please log in or create an account to purchase this vehicle and reserve your stock.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold shadow-md shadow-amber-600/20"
            >
              <ShoppingBag className="w-4 h-4" />
              Sign In to Complete Purchase
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>

            <Link
              to="/register"
              className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <UserPlus className="w-4 h-4" />
              Create a New Account
            </Link>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 font-medium transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
