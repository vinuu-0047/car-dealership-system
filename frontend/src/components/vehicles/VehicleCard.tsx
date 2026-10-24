import React, { useState } from 'react';
import { ShoppingCart, RotateCcw, Edit, Trash2, Zap } from 'lucide-react';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { formatPrice, getStockBadge, getCategoryIcon } from '../../lib/utils';
import { usePurchaseVehicle, useDeleteVehicle } from '../../hooks/useVehicles';
import { useAuthStore } from '../../store/authStore';
import { RestockModal } from './RestockModal';
import { EditVehicleModal } from './EditVehicleModal';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const purchase = usePurchaseVehicle();
  const deleteVehicle = useDeleteVehicle();
  const [showRestock, setShowRestock] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const stock = getStockBadge(vehicle.quantity);
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <>
      <div className="card group hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col">
        {/* Image / Category Header */}
        <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-xl flex items-center justify-center overflow-hidden">
          <span className="text-6xl">{getCategoryIcon(vehicle.category)}</span>
          <div className="absolute top-3 right-3">
            <Badge variant={stock.variant}>{stock.label}</Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="info">{vehicle.category}</Badge>
          </div>
          {vehicle.category === 'Electric' && (
            <div className="absolute bottom-3 right-3">
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-bold text-white leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3 font-mono">VIN: {vehicle.vin}</p>

          <div className="mt-auto">
            <p className="text-2xl font-bold text-blue-400 mb-4">
              {formatPrice(vehicle.price)}
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => !isOutOfStock && !purchase.isPending && purchase.mutate(vehicle.id)}
                disabled={isOutOfStock || purchase.isPending}
                className="flex-1 flex items-center justify-center gap-2 btn-primary text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : purchase.isPending ? 'Buying...' : 'Purchase'}
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
                    className="bg-emerald-700 hover:bg-emerald-600 text-white p-2.5 rounded-lg transition-colors"
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
    </>
  );
};
