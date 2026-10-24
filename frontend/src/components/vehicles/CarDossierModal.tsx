import React, { useState, useMemo } from 'react';
import {
  X,
  Car,
  Shield,
  Zap,
  Fuel,
  Settings,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  Building2,
  Smartphone,
  ChevronRight,
  ArrowLeft,
  Check,
  Download,
  Printer,
  Sparkles,
  Lock,
  User,
  ShoppingBag,
} from 'lucide-react';
import { Vehicle } from '../../types';
import { Badge } from '../ui/Badge';
import { formatPrice, getStockBadge } from '../../lib/utils';
import { getCarSpecs, COMMON_ACCESSORIES, AccessoryOption } from '../../lib/carSpecs';
import { usePurchaseVehicle } from '../../hooks/useVehicles';
import { useAuthStore } from '../../store/authStore';
import { useLogin } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

type TabType = 'dossier' | 'payment' | 'success';
type PaymentMethodType = 'upi' | 'emi' | 'card' | 'netbanking' | 'token';

export const CarDossierModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const { user, isAuthenticated } = useAuthStore();
  const purchase = usePurchaseVehicle();
  const loginMutation = useLogin();

  const [currentTab, setCurrentTab] = useState<TabType>('dossier');
  const specs = useMemo(() => getCarSpecs(vehicle.model), [vehicle.model]);

  // Customization state
  const [selectedColor, setSelectedColor] = useState(specs.colors[0]?.name || 'Standard');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['warranty']);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [emiTenure, setEmiTenure] = useState<36 | 60 | 84>(60);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Stock status
  const stock = getStockBadge(vehicle.quantity);
  const isOutOfStock = vehicle.quantity === 0;

  // Price calculations
  const exShowroom = Number(vehicle.price);
  const rtoTax = Math.round(exShowroom * 0.085); // 8.5% average RTO
  const insurance = Math.round(exShowroom * 0.035); // 3.5% insurance
  const fastagAndHandling = 4500;

  const accessoriesTotal = useMemo(() => {
    return selectedAccessories.reduce((sum, id) => {
      const acc = COMMON_ACCESSORIES.find((a) => a.id === id);
      return sum + (acc ? acc.price : 0);
    }, 0);
  }, [selectedAccessories]);

  const onRoadTotal = exShowroom + rtoTax + insurance + fastagAndHandling + accessoriesTotal;
  const tokenAdvanceAmount = 25000;

  const toggleAccessory = (id: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Live EMI calculation (8.75% annual interest)
  const monthlyEmi = useMemo(() => {
    const principal = onRoadTotal * 0.85; // 85% loan, 15% down payment
    const rate = 0.0875 / 12;
    const emi =
      (principal * rate * Math.pow(1 + rate, emiTenure)) /
      (Math.pow(1 + rate, emiTenure) - 1);
    return Math.round(emi);
  }, [onRoadTotal, emiTenure]);

  // Quick Demo Login for Guests
  const handleQuickDemoLogin = (role: 'CUSTOMER' | 'ADMIN') => {
    const creds =
      role === 'ADMIN'
        ? { email: 'admin@cardealership.com', password: 'Admin@12345' }
        : { email: 'customer@example.com', password: 'Customer@12345' };

    loginMutation.mutate(creds, {
      onSuccess: () => {
        toast.success(`Logged in as ${role === 'ADMIN' ? 'Admin' : 'Customer'}!`);
      },
    });
  };

  // Submit Order / Payment
  const handleConfirmPayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in or use 1-Click Guest Login to complete your booking.');
      return;
    }

    if (isOutOfStock) {
      toast.error('This vehicle is currently out of stock.');
      return;
    }

    setIsProcessing(true);

    purchase.mutate(vehicle.id, {
      onSuccess: () => {
        setIsProcessing(false);
        const refId = `CW-IND-${Date.now().toString().slice(-6)}`;
        setBookingRef(refId);
        setCurrentTab('success');
      },
      onError: (err: any) => {
        setIsProcessing(false);
        toast.error(err.response?.data?.message || 'Payment processing failed');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0b1320] border border-zinc-700/80 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ======================================================== */}
        {/* Modal Header                                             */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-[#070b12]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-500/50 flex items-center justify-center text-teal-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <Badge variant={stock.variant}>{stock.label}</Badge>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                VIN: {vehicle.vin} • Category: {vehicle.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Steps indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold mr-3">
              <span
                className={`px-2.5 py-1 rounded-full ${
                  currentTab === 'dossier'
                    ? 'bg-teal-500 text-teal-950 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                1. Car Folder
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span
                className={`px-2.5 py-1 rounded-full ${
                  currentTab === 'payment'
                    ? 'bg-teal-500 text-teal-950 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                2. Payment Options
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
              <span
                className={`px-2.5 py-1 rounded-full ${
                  currentTab === 'success'
                    ? 'bg-teal-500 text-teal-950 font-bold'
                    : 'text-zinc-400'
                }`}
              >
                3. Receipt
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* Modal Scrollable Body                                    */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ==================================================== */}
          {/* TAB 1: CAR DOSSIER / FOLDER                          */}
          {/* ==================================================== */}
          {currentTab === 'dossier' && (
            <div className="space-y-6">
              {/* Hero Image & Price Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#070b12] border border-zinc-800/80 rounded-2xl p-4 sm:p-5">
                <div className="lg:col-span-7 h-56 sm:h-72 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center relative">
                  {vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.model}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <Car className="w-20 h-20 text-zinc-600" />
                  )}
                  <div className="absolute top-3 left-3 bg-[#0b1320]/80 backdrop-blur-sm border border-zinc-700/80 text-teal-300 text-[11px] font-bold px-3 py-1 rounded-full">
                    Selected Color: {selectedColor}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-widest">
                      Authentic Indian Spec
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{specs.safetyRating}</p>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-[#111927] border border-zinc-800 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-zinc-400">Ex-Showroom Price</span>
                      <span className="text-base font-bold text-white">
                        {formatPrice(exShowroom)}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-zinc-400">
                      <span>RTO Registration & Tax</span>
                      <span>+ {formatPrice(rtoTax)}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs text-zinc-400">
                      <span>Comprehensive 1-Yr Insurance</span>
                      <span>+ {formatPrice(insurance)}</span>
                    </div>
                    {accessoriesTotal > 0 && (
                      <div className="flex justify-between items-baseline text-xs text-teal-400">
                        <span>Selected Accessories ({selectedAccessories.length})</span>
                        <span>+ {formatPrice(accessoriesTotal)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-zinc-700 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-white">Est. On-Road Price</span>
                      <span className="text-xl font-black text-teal-400">
                        {formatPrice(onRoadTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Color Selector */}
                  <div>
                    <p className="text-xs font-bold text-zinc-300 mb-2">
                      Available Exterior Colors:
                    </p>
                    <div className="flex items-center gap-3">
                      {specs.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                            selectedColor === c.name
                              ? 'border-teal-400 scale-110 shadow-lg shadow-teal-500/30'
                              : 'border-zinc-700 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.name && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                c.hex === '#f8fafc' || c.hex === '#f4f4f5'
                                  ? 'text-zinc-900'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Dossier Table */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>📋</span> Detailed Technical Dossier
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Engine / Motor</p>
                    <p className="font-bold text-white mt-1 truncate" title={specs.engine}>
                      {specs.engine}
                    </p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Peak Power</p>
                    <p className="font-bold text-white mt-1">{specs.power}</p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Peak Torque</p>
                    <p className="font-bold text-white mt-1">{specs.torque}</p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Transmission</p>
                    <p className="font-bold text-white mt-1 truncate" title={specs.transmission}>
                      {specs.transmission}
                    </p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Fuel & Range/Mileage</p>
                    <p className="font-bold text-white mt-1">{specs.mileage}</p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Seating Capacity</p>
                    <p className="font-bold text-white mt-1">{specs.seating}</p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Boot Capacity</p>
                    <p className="font-bold text-white mt-1">{specs.bootSpace}</p>
                  </div>
                  <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-3">
                    <p className="text-zinc-400 font-medium">Ground Clearance</p>
                    <p className="font-bold text-white mt-1">{specs.groundClearance}</p>
                  </div>
                </div>
              </div>

              {/* Key Highlights & Equipment */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>⭐</span> Key Equipment & Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {specs.keyFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 bg-[#070b12] border border-zinc-800/80 rounded-lg text-zinc-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Accessories & Add-ons Checklist */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>🛠️</span> Optional Add-ons & Extended Protection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMMON_ACCESSORIES.map((acc) => {
                    const isSelected = selectedAccessories.includes(acc.id);
                    return (
                      <div
                        key={acc.id}
                        onClick={() => toggleAccessory(acc.id)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-teal-950/30 border-teal-500/80 text-white'
                            : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-teal-500 border-teal-500 text-black'
                              : 'border-zinc-600'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-white">{acc.name}</span>
                            <span className="text-xs font-extrabold text-teal-400">
                              + {formatPrice(acc.price)}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                            {acc.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PAYMENT OPTIONS STEP                          */}
          {/* ==================================================== */}
          {currentTab === 'payment' && (
            <div className="space-y-6">
              {/* Guest / User Identification Card */}
              {!isAuthenticated && (
                <div className="bg-amber-950/30 border border-amber-600/50 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Guest Checkout — Quick Account Link
                      </h4>
                      <p className="text-xs text-amber-200/80">
                        Sign in with 1-click to attach this reservation to your profile.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickDemoLogin('CUSTOMER')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      ⚡ 1-Click Login as Vikram Sharma (Customer)
                    </button>
                    <button
                      onClick={() => handleQuickDemoLogin('ADMIN')}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-lg transition-colors"
                    >
                      Login as Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Order Summary Pill */}
              <div className="bg-[#070b12] border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-10 rounded-lg overflow-hidden bg-zinc-900">
                    {vehicle.imageUrl && (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Color: <strong className="text-teal-400">{selectedColor}</strong> • Add-ons:{' '}
                      {selectedAccessories.length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total Payable</p>
                  <p className="text-xl font-black text-teal-400">{formatPrice(onRoadTotal)}</p>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Select Payment Option (Indian Banking & UPI)
                </h4>

                {/* Method Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4 text-xs font-bold">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-md'
                        : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('emi')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'emi'
                        ? 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-md'
                        : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Bank EMI Loan</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-md'
                        : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card (RuPay/Visa)</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-teal-950/40 border-teal-500 text-teal-300 shadow-md'
                        : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Net Banking</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('token')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'token'
                        ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-[#070b12] border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>₹25,000 Token</span>
                  </button>
                </div>

                {/* Sub-panel 1: UPI */}
                {paymentMethod === 'upi' && (
                  <div className="bg-[#070b12] border border-zinc-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Simulated QR Code */}
                      <div className="w-36 h-36 bg-white p-2 rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                        <QrCode className="w-28 h-28 text-black" />
                        <span className="text-[9px] text-zinc-800 font-bold">SCAN WITH ANY APP</span>
                      </div>
                      <div className="space-y-3 flex-1 text-xs">
                        <p className="text-zinc-300 font-semibold">
                          Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>,{' '}
                          <strong>Paytm</strong>, or enter your VPA / UPI ID below:
                        </p>
                        <div>
                          <label className="block text-[11px] text-zinc-400 mb-1">
                            Your Virtual Payment Address (UPI ID)
                          </label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full bg-[#111927] border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-teal-400"
                          />
                        </div>
                        <p className="text-[11px] text-teal-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Zero convenience fees on verified UPI transfers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel 2: EMI Loan */}
                {paymentMethod === 'emi' && (
                  <div className="bg-[#070b12] border border-zinc-800 rounded-2xl p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 mb-1 font-semibold">
                          Preferred Lending Partner
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-[#111927] border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none"
                        >
                          <option value="HDFC Bank">HDFC Bank (8.65% p.a.)</option>
                          <option value="SBI Car Loan">State Bank of India (8.75% p.a.)</option>
                          <option value="ICICI Bank">ICICI Bank (8.80% p.a.)</option>
                          <option value="Axis Bank">Axis Bank (8.90% p.a.)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 font-semibold">
                          Loan Tenure Duration
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[36, 60, 84].map((tenure) => (
                            <button
                              key={tenure}
                              onClick={() => setEmiTenure(tenure as any)}
                              className={`py-2 rounded-lg border font-bold transition-all ${
                                emiTenure === tenure
                                  ? 'bg-teal-500 text-teal-950 border-teal-400'
                                  : 'bg-[#111927] border-zinc-700 text-zinc-400'
                              }`}
                            >
                              {tenure / 12} Yrs ({tenure}m)
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Calculated EMI Display */}
                    <div className="bg-[#111927] border border-teal-500/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] text-zinc-400">Monthly Installment (Estimated)</p>
                        <p className="text-2xl font-black text-teal-400">
                          {formatPrice(monthlyEmi)}{' '}
                          <span className="text-xs text-zinc-400 font-normal">/ month</span>
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-zinc-400">
                        <p>Down Payment (15%): {formatPrice(Math.round(onRoadTotal * 0.15))}</p>
                        <p>Financed Amount: {formatPrice(Math.round(onRoadTotal * 0.85))}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel 3: Card */}
                {paymentMethod === 'card' && (
                  <div className="bg-[#070b12] border border-zinc-800 rounded-2xl p-5 space-y-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1">Card Number (RuPay / Visa / Master)</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#111927] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-zinc-400 mb-1">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#111927] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-400 mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          maxLength={4}
                          className="w-full bg-[#111927] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel 4: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="bg-[#070b12] border border-zinc-800 rounded-2xl p-5 text-xs">
                    <p className="text-zinc-400 mb-3">Select your bank for secure NetBanking portal redirect:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBank(b)}
                          className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                            selectedBank === b
                              ? 'bg-teal-950 border-teal-500 text-teal-300'
                              : 'bg-[#111927] border-zinc-700 text-zinc-300 hover:border-zinc-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-panel 5: Token Advance */}
                {paymentMethod === 'token' && (
                  <div className="bg-amber-950/20 border border-amber-600/40 rounded-2xl p-5 text-xs space-y-2">
                    <p className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Lock & Reserve Inventory With ₹25,000 Token Advance
                    </p>
                    <p className="text-zinc-300 leading-relaxed">
                      Lock your vehicle VIN (<strong className="font-mono text-white">{vehicle.vin}</strong>) immediately in inventory. The remaining balance of {formatPrice(onRoadTotal - tokenAdvanceAmount)} can be paid via cash, RTGS, or car loan upon dealer delivery.
                    </p>
                    <p className="text-amber-400 font-bold mt-2">
                      Amount Due Today: {formatPrice(tokenAdvanceAmount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: BOOKING SUCCESS RECEIPT                       */}
          {/* ==================================================== */}
          {currentTab === 'success' && (
            <div className="text-center py-6 px-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Booking Confirmed! 🎉</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Your vehicle reservation has been safely recorded in the dealership inventory system.
                </p>
              </div>

              {/* Dossier Receipt Card */}
              <div className="max-w-md mx-auto bg-[#070b12] border border-zinc-700 rounded-2xl p-5 text-left text-xs space-y-3 font-mono">
                <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
                  <span className="text-zinc-400 font-sans">Booking ID:</span>
                  <span className="text-teal-400 font-bold text-sm">{bookingRef}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Vehicle:</span>
                  <span className="text-white font-bold">{vehicle.make} {vehicle.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">VIN:</span>
                  <span className="text-zinc-300">{vehicle.vin}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Selected Color:</span>
                  <span className="text-zinc-300">{selectedColor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-sans">Payment Method:</span>
                  <span className="text-zinc-300 uppercase">{paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-sm font-sans">
                  <span className="text-white font-bold">Total Amount Paid:</span>
                  <span className="text-teal-400 font-black">
                    {paymentMethod === 'token' ? formatPrice(tokenAdvanceAmount) : formatPrice(onRoadTotal)}
                  </span>
                </div>
              </div>

              {/* Receipt Action Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print Official Receipt
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  Back to Showroom
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* Modal Footer Controls                                    */}
        {/* ======================================================== */}
        {currentTab !== 'success' && (
          <div className="px-5 py-4 border-t border-zinc-800 bg-[#070b12] flex items-center justify-between gap-4">
            {currentTab === 'dossier' ? (
              <>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-semibold">Total On-Road</p>
                  <p className="text-lg sm:text-xl font-black text-teal-400">
                    {formatPrice(onRoadTotal)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setCurrentTab('payment')}
                    disabled={isOutOfStock}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all"
                  >
                    <span>Proceed to Payment Options</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentTab('dossier')}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Car Folder</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-zinc-400 uppercase font-semibold">Amount to Pay</p>
                    <p className="text-base font-black text-teal-400">
                      {paymentMethod === 'token' ? formatPrice(tokenAdvanceAmount) : formatPrice(onRoadTotal)}
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessing || isOutOfStock}
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/30 flex items-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isProcessing
                        ? 'Confirming Transaction...'
                        : `Pay ${paymentMethod === 'token' ? formatPrice(tokenAdvanceAmount) : formatPrice(onRoadTotal)} & Confirm Booking`}
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
