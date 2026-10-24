import React, { useState } from 'react';
import { ShoppingCart, RotateCcw, Edit, Trash2, Zap } from 'lucide-react';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { formatPrice, getStockBadge, getCategoryIcon } from '../../lib/utils';
import { usePurchaseVehicle, useDeleteVehicle } from '../../hooks/useVehicles';
import { useAuthStore } from '../../store/authStore';
import { RestockModal } from './RestockModal';
import { EditVehicleModal } from './EditVehicleModal';
import { AuthPromptModal } from './AuthPromptModal';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const purchase = usePurchaseVehicle();
  const deleteVehicle = useDeleteVehicle();
  const [showRestock, setShowRestock] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const stock = getStockBadge(vehicle.quantity);
  const isOutOfStock = vehicle.quantity === 0;

  const handlePurchaseClick = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }
    if (!isOutOfStock && !purchase.isPending) {
      purchase.mutate(vehicle.id);
    }
  };

  return (
    <>
      <div className="card group hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col overflow-hidden">
        {/* Image / Header */}
        <div className="relative h-52 bg-zinc-100 dark:bg-zinc-800 rounded-t-xl overflow-hidden flex items-center justify-center">
          {vehicle.imageUrl ? (
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-6xl">{getCategoryIcon(vehicle.category)}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={stock.variant}>{stock.label}</Badge>
          </div>
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="info">{vehicle.category}</Badge>
          </div>
          {vehicle.category === 'Electric' && (
            <div className="absolute bottom-3 right-3 z-10">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-mono">VIN: {vehicle.vin}</p>

          <div className="mt-auto pt-2">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mb-4 tracking-tight">
              {formatPrice(vehicle.price)}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handlePurchaseClick}
                disabled={isOutOfStock || purchase.isPending}
                className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm py-2.5"
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Sold Out' : purchase.isPending ? 'Processing...' : 'Purchase'}
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowEdit(true)}
                    className="btn-secondary p-2.5 rounded-lg"
                    title="Edit vehicle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowRestock(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg transition-colors"
                    title="Restock inventory"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) {
                        deleteVehicle.mutate(vehicle.id);
                      }
                    }}
                    className="btn-danger p-2.5 rounded-lg"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRestock && <RestockModal vehicle={vehicle} onClose={() => setShowRestock(false)} />}
      {showEdit && <EditVehicleModal vehicle={vehicle} onClose={() => setShowEdit(false)} />}
      {showAuthPrompt && <AuthPromptModal vehicle={vehicle} onClose={() => setShowAuthPrompt(false)} />}
    </>
  );
};
