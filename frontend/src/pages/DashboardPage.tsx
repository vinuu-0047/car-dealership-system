import React, { useState } from 'react';
import { Search, PlusCircle, Car, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import { useAuthStore } from '../store/authStore';

const CATEGORIES = ['All', 'Sedan', 'SUV', 'Truck', 'Sports', 'Electric', 'Hybrid'];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Simple debounce for search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = {
    ...(debouncedSearch && { make: debouncedSearch }),
    ...(category !== 'All' && { category }),
    page,
    limit: 12,
  };

  const { data, isLoading, isError } = useVehicles(params);

  // Stats
  const totalVehicles = data?.total ?? 0;
  const inStockCount = data?.vehicles.filter(v => v.quantity > 0).length ?? 0;
  const outOfStockCount = data?.vehicles.filter(v => v.quantity === 0).length ?? 0;
  const totalValue = data?.vehicles.reduce((sum, v) => sum + Number(v.price) * v.quantity, 0) ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isAdmin ? '🛡️ Admin Inventory' : '🚗 Vehicle Catalog'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isAdmin ? 'Manage your complete vehicle inventory' : 'Browse and purchase available vehicles'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Vehicle
          </button>
        )}
      </div>

      {/* Stats row (Admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVehicles}</p>
              <p className="text-xs text-slate-400">Total Listings</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{inStockCount}</p>
              <p className="text-xs text-slate-400">In Stock</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-900/50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{outOfStockCount}</p>
              <p className="text-xs text-slate-400">Out of Stock</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-purple-400">
                ${(totalValue / 1_000_000).toFixed(2)}M
              </p>
              <p className="text-xs text-slate-400">Inventory Value</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by make, model..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse">
              <div className="h-48 bg-slate-700 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-700 rounded w-3/4" />
                <div className="h-4 bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">Failed to load vehicles. Please try again.</p>
        </div>
      ) : data?.vehicles.length === 0 ? (
        <div className="text-center py-20">
          <Car className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No vehicles found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4">← Prev</button>
              <span className="flex items-center px-4 text-slate-400">Page {page} of {data.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="btn-secondary px-4">Next →</button>
            </div>
          )}
        </>
      )}

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};
