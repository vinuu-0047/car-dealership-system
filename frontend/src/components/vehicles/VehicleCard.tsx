import React, { useState } from 'react';
import { ShoppingCart, RotateCcw, Edit, Trash2, Zap, FolderOpen, ArrowRight } from 'lucide-react';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { formatPrice, getStockBadge, getCategoryIcon } from '../../lib/utils';
import { useDeleteVehicle } from '../../hooks/useVehicles';
import { useAuthStore } from '../../store/authStore';
import { RestockModal } from './RestockModal';
import { EditVehicleModal } from './EditVehicleModal';
import { CarDossierModal } from './CarDossierModal';

interface VehicleCardProps {
  vehicle: Vehicle;
  onOpenDossier?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onOpenDossier }) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const deleteVehicle = useDeleteVehicle();

  const [showRestock, setShowRestock] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDossier, setShowDossier] = useState(false);

  const stock = getStockBadge(vehicle.quantity);
  const isOutOfStock = vehicle.quantity === 0;

  const handleCardClick = () => {
    if (onOpenDossier) {
      onOpenDossier(vehicle);
    } else {
      setShowDossier(true);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group bg-[#0d1624] hover:bg-[#121c2d] border border-zinc-800/90 hover:border-teal-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-500/10 flex flex-col overflow-hidden cursor-pointer"
      >
        {/* Vehicle Image Header */}
        <div className="relative h-48 sm:h-52 bg-zinc-900 rounded-t-2xl overflow-hidden flex items-center justify-center">
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

          {/* Dark gradient overlay at bottom of photo for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />

          {/* Stock Status Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant={stock.variant}>{stock.label}</Badge>
          </div>

          {/* Category Tag Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#070b12]/90 text-zinc-300 border border-zinc-700/80 backdrop-blur-sm">
              {vehicle.category}
            </span>
          </div>

          {/* Electric Indicator */}
          {vehicle.category === 'Electric' && (
            <div className="absolute bottom-3 right-3 z-10 bg-emerald-950/90 border border-emerald-500/80 p-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          )}

          {/* Quick Hover Dossier Pill */}
          <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-3 py-1 bg-teal-500 text-teal-950 text-[10px] font-black rounded-full shadow-lg flex items-center gap-1">
              <FolderOpen className="w-3 h-3" /> Click to Open Car Folder
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col flex-1">
          {/* Make & Model */}
          <div className="mb-1">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              {vehicle.make}
            </p>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight truncate group-hover:text-teal-300 transition-colors">
              {vehicle.year} {vehicle.model}
            </h3>
          </div>

          {/* VIN & Details */}
          <p className="text-[10px] text-zinc-500 mb-3 font-mono">VIN: {vehicle.vin}</p>

          {/* Price & Action Button */}
          <div className="mt-auto pt-2 border-t border-zinc-800/80">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <p className="text-[10px] text-zinc-400 font-semibold">Avg. Ex-Showroom</p>
                <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {formatPrice(vehicle.price)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-teal-600/20 active:scale-[0.98]"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>{isOutOfStock ? 'Sold Out' : 'Open Folder & Book'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-auto" />
              </button>

              {isAdmin && (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setShowEdit(true)}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Edit vehicle"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setShowRestock(true)}
                    className="p-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 transition-colors"
                    title="Restock inventory"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${vehicle.make} ${vehicle.model}?`)) {
                        deleteVehicle.mutate(vehicle.id);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800/80 text-rose-300 transition-colors"
                    title="Delete vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDossier && (
        <CarDossierModal
          vehicle={vehicle}
          onClose={() => setShowDossier(false)}
        />
      )}

      {showRestock && <RestockModal vehicle={vehicle} onClose={() => setShowRestock(false)} />}
      {showEdit && <EditVehicleModal vehicle={vehicle} onClose={() => setShowEdit(false)} />}
    </>
  );
};
