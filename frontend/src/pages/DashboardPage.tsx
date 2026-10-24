import React, { useState, useRef } from 'react';
import {
  Search,
  PlusCircle,
  Car,
  Package,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Fuel,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  MapPin,
} from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { AddVehicleModal } from '../components/vehicles/AddVehicleModal';
import { CarDossierModal } from '../components/vehicles/CarDossierModal';
import { useAuthStore } from '../store/authStore';
import { formatPrice } from '../lib/utils';
import { Vehicle } from '../types';

type BudgetTier = 'all' | 'under10' | '10to20' | 'above20';

const POPULAR_BUDGETS: { id: BudgetTier; label: string }[] = [
  { id: 'under10', label: 'Cars Under 10 Lakh' },
  { id: '10to20', label: 'Cars 10 - 20 Lakh' },
  { id: 'above20', label: 'Cars Above 20 Lakh' },
  { id: 'all', label: 'All Budgets' },
];

const BODY_SUB_FILTERS = [
  { id: 'All', label: 'All Body Types' },
  { id: 'SUV', label: 'Sub Compact SUV' },
  { id: 'Hatchback', label: 'Hatchback' },
  { id: 'Sedan', label: 'Sedan & Others' },
  { id: 'Electric', label: 'Electric EV' },
  { id: '4x4 Off-Road', label: '4x4 Off-Road' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  // Filters State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [carCondition, setCarCondition] = useState<'new' | 'used'>('new');
  const [selectedBudget, setSelectedBudget] = useState<BudgetTier>('all');
  const [selectedBodyType, setSelectedBodyType] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTransmission, setSelectedTransmission] = useState('All');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDossierVehicle, setSelectedDossierVehicle] = useState<Vehicle | null>(null);

  // Trending container scroll ref
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Budget range calculation
  const budgetRange = React.useMemo(() => {
    switch (selectedBudget) {
      case 'under10':
        return { maxPrice: 1000000 };
      case '10to20':
        return { minPrice: 1000000, maxPrice: 2000000 };
      case 'above20':
        return { minPrice: 2000000 };
      default:
        return {};
    }
  }, [selectedBudget]);

  // Query params for backend API
  const params = {
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedBodyType !== 'All' ? { category: selectedBodyType } : {}),
    ...budgetRange,
    page,
    limit: 16,
  };

  const { data, isLoading, isError } = useVehicles(params);

  // Trending models for top shelf
  const allVehicles = data?.vehicles || [];
  const trendingCars = allVehicles.slice(0, 8);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingScrollRef.current) {
      const scrollAmount = 300;
      trendingScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Stats for Admin
  const totalVehicles = data?.total ?? 0;
  const inStockCount = allVehicles.filter((v) => v.quantity > 0).length;
  const outOfStockCount = allVehicles.filter((v) => v.quantity === 0).length;
  const totalValue = allVehicles.reduce(
    (sum, v) => sum + Number(v.price) * v.quantity,
    0
  );

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBudget('all');
    setSelectedBodyType('All');
    setSelectedFuel('All');
    setSelectedTransmission('All');
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    selectedBudget !== 'all' ||
    selectedBodyType !== 'All' ||
    selectedFuel !== 'All' ||
    selectedTransmission !== 'All';

  return (
    <div className="min-h-screen bg-[#070b12] text-zinc-100 transition-colors">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: "Find Your Right Car" (CarWale Layout)  */}
      {/* ======================================================== */}
      <section className="relative bg-[#070b12] pt-8 pb-8 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto">
          {/* Header row: Left Title & Right Select City */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Find Your Right Car
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer transition-colors">
              <span>Select City</span>
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>

          {/* Integrated Search Capsule (Single Seamless Container) */}
          <div className="relative flex items-center bg-[#0d1624] border border-zinc-800/90 rounded-full p-1.5 sm:p-2 mb-4 shadow-xl focus-within:border-teal-500/80 transition-all">
            {/* [New] / [Used] Segmented Pill */}
            <div className="flex items-center bg-[#152132] rounded-full p-0.5 mr-2 sm:mr-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCarCondition('new')}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  carCondition === 'new'
                    ? 'bg-[#6fe2dc] text-[#062c2b] shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                New
              </button>
              <button
                type="button"
                onClick={() => setCarCondition('used')}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  carCondition === 'used'
                    ? 'bg-[#6fe2dc] text-[#062c2b] shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Used
              </button>
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Type to select car name"
              className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-0 px-2"
            />

            {/* Magnifying Glass Icon on Far Right */}
            <div className="px-3 text-zinc-400 flex items-center justify-center">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300" />
            </div>
          </div>

          {/* Quick Filter Chips Row (Budget, Body Type, Fuel Type, Transmission, All Filters) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {/* 1. Budget Chip */}
            <div className="relative flex items-center gap-1.5 px-3.5 py-2 bg-[#0d1624] hover:bg-[#142135] border border-zinc-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedBudget}
                onChange={(e) => {
                  setSelectedBudget(e.target.value as BudgetTier);
                  setPage(1);
                }}
                className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0f172a]">Budget: All</option>
                <option value="under10" className="bg-[#0f172a]">Under 10 Lakh</option>
                <option value="10to20" className="bg-[#0f172a]">10 - 20 Lakh</option>
                <option value="above20" className="bg-[#0f172a]">Above 20 Lakh</option>
              </select>
            </div>

            {/* 2. Body Type Chip */}
            <div className="relative flex items-center gap-1.5 px-3.5 py-2 bg-[#0d1624] hover:bg-[#142135] border border-zinc-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
              <Car className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedBodyType}
                onChange={(e) => {
                  setSelectedBodyType(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0f172a]">Body Type: All</option>
                <option value="SUV" className="bg-[#0f172a]">SUV</option>
                <option value="Hatchback" className="bg-[#0f172a]">Hatchback</option>
                <option value="Sedan" className="bg-[#0f172a]">Sedan</option>
                <option value="Electric" className="bg-[#0f172a]">Electric (EV)</option>
                <option value="4x4 Off-Road" className="bg-[#0f172a]">4x4 Off-Road</option>
              </select>
            </div>

            {/* 3. Fuel Type Chip */}
            <div className="relative flex items-center gap-1.5 px-3.5 py-2 bg-[#0d1624] hover:bg-[#142135] border border-zinc-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
              <Fuel className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={selectedFuel}
                onChange={(e) => {
                  setSelectedFuel(e.target.value);
                  if (e.target.value === 'Electric') {
                    setSelectedBodyType('Electric');
                  }
                  setPage(1);
                }}
                className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0f172a]">Fuel Type: All</option>
                <option value="Petrol" className="bg-[#0f172a]">Petrol</option>
                <option value="Diesel" className="bg-[#0f172a]">Diesel</option>
                <option value="Electric" className="bg-[#0f172a]">Electric</option>
                <option value="Hybrid" className="bg-[#0f172a]">Hybrid</option>
              </select>
            </div>

            {/* 4. Transmission Chip */}
            <div className="relative flex items-center gap-1.5 px-3.5 py-2 bg-[#0d1624] hover:bg-[#142135] border border-zinc-800 rounded-lg cursor-pointer transition-colors whitespace-nowrap">
              <span className="text-zinc-400 text-xs">🕹️</span>
              <select
                value={selectedTransmission}
                onChange={(e) => {
                  setSelectedTransmission(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-zinc-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="All" className="bg-[#0f172a]">Transmission: All</option>
                <option value="Manual" className="bg-[#0f172a]">Manual</option>
                <option value="Automatic" className="bg-[#0f172a]">Automatic</option>
              </select>
            </div>

            {/* 5. All Filters / Reset */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-950/60 hover:bg-red-900/60 border border-red-800/80 rounded-lg text-red-300 font-semibold transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. TRENDING CARS SHELF (Direct Match to CarWale Design)   */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-[#0b1320] border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative shadow-lg">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-teal-400 font-bold text-sm">📈</span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Trending Cars
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollTrending('left')}
                aria-label="Scroll left"
                className="w-7 h-7 rounded-full bg-[#152132] hover:bg-[#1d2d44] border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollTrending('right')}
                aria-label="Scroll right"
                className="w-7 h-7 rounded-full bg-[#152132] hover:bg-[#1d2d44] border border-zinc-700/60 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Cards Shelf */}
          <div
            ref={trendingScrollRef}
            className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
          >
            {trendingCars.map((v, idx) => (
              <div
                key={v.id}
                onClick={() => setSelectedDossierVehicle(v)}
                className="group relative flex items-center gap-3 bg-[#131c2a] hover:bg-[#19263a] border border-zinc-800/90 hover:border-teal-500/50 rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all duration-200 flex-shrink-0 w-52 sm:w-56"
              >
                {/* Ad / Sponsored Badge (Index 0 gets Ad tag like reference image) */}
                {idx === 0 && (
                  <span className="absolute top-2 right-2 text-[9px] font-semibold text-zinc-400 bg-zinc-800/80 px-1 py-0.2 rounded">
                    Ad
                  </span>
                )}

                {/* Left: Thumbnail Image */}
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-zinc-900/80 flex items-center justify-center flex-shrink-0">
                  {v.imageUrl ? (
                    <img
                      src={v.imageUrl}
                      alt={v.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-xl">🚗</span>
                  )}
                </div>

                {/* Right: Car Name & Price */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate group-hover:text-teal-300 transition-colors">
                    {v.model}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{v.make}</p>
                  <p className="text-[11px] font-extrabold text-teal-400 mt-0.5">
                    {formatPrice(v.price)}
                  </p>
                </div>
              </div>
            ))}

            {/* Next Chevron Button at end of row */}
            <button
              onClick={() => scrollTrending('right')}
              className="flex-shrink-0 w-8 h-12 bg-[#131c2a] hover:bg-[#1a273b] border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. "Popular Cars By Budget" Section                       */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Section Heading with Amber Accent Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Popular Cars By Budget
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-sm inline-block" />
              <span className="text-sm font-bold text-white">
                {POPULAR_BUDGETS.find((b) => b.id === selectedBudget)?.label || 'All Cars'}
              </span>
              <span className="text-xs text-zinc-400 ml-2">
                ({data?.vehicles.length || 0} models available)
              </span>
            </div>
          </div>

          {/* Admin "Add Vehicle" Button */}
          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="btn-primary flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30 text-xs px-4 py-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Vehicle
            </button>
          )}
        </div>

        {/* Budget Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 text-xs font-bold scrollbar-none">
          {POPULAR_BUDGETS.map((b) => (
            <button
              key={b.id}
              onClick={() => {
                setSelectedBudget(b.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                selectedBudget === b.id
                  ? 'bg-zinc-100 text-zinc-950 font-extrabold shadow-sm'
                  : 'bg-[#111927] text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Sub-Filters: Body Types Pills (Sub Compact SUV, Hatchback, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 text-xs font-semibold scrollbar-none">
          {BODY_SUB_FILTERS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedBodyType(cat.id);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                selectedBodyType === cat.id
                  ? 'border-teal-400 text-teal-300 bg-teal-950/40 shadow-sm shadow-teal-500/20'
                  : 'border-zinc-800 bg-[#0d1624] text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Admin Inventory Overview Stats Row */}
        {isAdmin && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0d1624] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-950/60 rounded-xl flex items-center justify-center text-red-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-white">{totalVehicles}</p>
                <p className="text-[11px] text-zinc-400 font-medium">Total Listings</p>
              </div>
            </div>
            <div className="bg-[#0d1624] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-950/60 rounded-xl flex items-center justify-center text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-emerald-400">{inStockCount}</p>
                <p className="text-[11px] text-zinc-400 font-medium">In Stock</p>
              </div>
            </div>
            <div className="bg-[#0d1624] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-950/60 rounded-xl flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl font-black text-rose-400">{outOfStockCount}</p>
                <p className="text-[11px] text-zinc-400 font-medium">Out of Stock</p>
              </div>
            </div>
            <div className="bg-[#0d1624] border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-amber-400">
                  ₹{(totalValue / 10000000).toFixed(2)} Cr
                </p>
                <p className="text-[11px] text-zinc-400 font-medium">Fleet Valuation</p>
              </div>
            </div>
          </div>
        )}

        {/* Cars Catalog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#0d1624] border border-zinc-800 rounded-2xl h-80 animate-pulse overflow-hidden"
              >
                <div className="h-52 bg-zinc-800/60" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-[#0d1624] border border-zinc-800 rounded-2xl p-8">
            <p className="text-red-400 text-base font-semibold">
              Failed to load vehicles from database.
            </p>
          </div>
        ) : data?.vehicles.length === 0 ? (
          <div className="text-center py-20 bg-[#0d1624] border border-zinc-800 rounded-2xl p-10">
            <Car className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No Indian vehicles found</h3>
            <p className="text-zinc-400 text-xs mt-1">
              Try adjusting your search query, budget tier, or body type filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onOpenDossier={(veh) => setSelectedDossierVehicle(veh)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold rounded-lg transition-colors"
                >
                  ← Prev
                </button>
                <span className="px-4 text-xs font-semibold text-zinc-400">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-bold rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Car Dossier & Booking Folder Modal */}
      {selectedDossierVehicle && (
        <CarDossierModal
          vehicle={selectedDossierVehicle}
          onClose={() => setSelectedDossierVehicle(null)}
        />
      )}

      {/* Admin Add Vehicle Modal */}
      {showAdd && <AddVehicleModal onClose={() => setShowAdd(false)} />}
    </div>
  );
};
