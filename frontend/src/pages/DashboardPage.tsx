import React, { useState } from 'react';
import { Search, PlusCircle, Car, Package, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import { useAuthStore } from '../store/authStore';

const CATEGORIES = ['All', 'SUV', 'Sedan', 'Hatchback', 'Electric', '4x4 Off-Road'];

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  // Simple debounce for search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
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
  const inStockCount = data?.vehicles.filter((v) => v.quantity > 0).length ?? 0;
  const outOfStockCount = data?.vehicles.filter((v) => v.quantity === 0).length ?? 0;
  const totalValue = data?.vehicles.reduce((sum, v) => sum + Number(v.price) * v.quantity, 0) ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Welcome Banner (Visible on Main Screen) */}
      {!isAdmin && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-8 sm:p-10 mb-8 border border-zinc-800 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" /> India's Premier Automotive Inventory
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Find Your Dream <span className="text-amber-500">Ride</span>
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Explore India's most popular SUVs, rugged 4x4s, electric crossovers, and luxury sedans.
              Browse live inventory freely — simply sign in when you're ready to purchase!
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none hidden md:block">
            <Car className="w-96 h-96 text-white" />
          </div>
        </div>
      )}

      {/* Admin Title & Add Button */}
      {isAdmin && (
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              🛡️ Dealership Fleet Management
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              Manage Indian inventory, live stock counts, and restock shipments
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 shadow-md shadow-amber-600/20">
            <PlusCircle className="w-4 h-4" />
            Add Vehicle
          </button>
        </div>
      )}

      {/* Stats row (Admin only) */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalVehicles}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Fleet Models</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{inStockCount}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">In Stock</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-950/60 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{outOfStockCount}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Sold Out</p>
            </div>
          </div>
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-black text-amber-600 dark:text-amber-400">
                ₹{(totalValue / 10000000).toFixed(2)} Cr
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Fleet Valuation</p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by brand or model (e.g. Thar, Nexon, Creta, Swift)..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                  : 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700'
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
            <div key={i} className="card h-80 animate-pulse overflow-hidden">
              <div className="h-52 bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 card p-8">
          <p className="text-rose-500 text-lg font-semibold">Failed to load vehicles. Please try again.</p>
        </div>
      ) : data?.vehicles.length === 0 ? (
        <div className="text-center py-20 card p-10">
          <Car className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Indian vehicles found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Try adjusting your search criteria or selecting a different category.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary px-4 py-2"
              >
                ← Prev
              </button>
              <span className="flex items-center px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="btn-secondary px-4 py-2"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};
