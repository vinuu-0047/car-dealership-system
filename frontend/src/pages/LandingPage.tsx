import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Zap, BarChart3, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => (
  <div className="min-h-[calc(100vh-4rem)]">
    {/* Hero */}
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-24 px-4">
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" /> TDD Kata — Production Grade Inventory System
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
          AutoElite
          <span className="block text-blue-400">Dealership</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          A production-ready car dealership inventory system with real-time stock management, role-based access control, and concurrency-safe transactions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg">
            Sign In
          </Link>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {[
          { icon: Car, color: 'text-blue-400', bg: 'bg-blue-900/50', title: 'Full Vehicle Catalog', desc: 'Browse, search, and filter our complete inventory of sedans, SUVs, trucks, EVs, and more.' },
          { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-900/50', title: 'Role-Based Access', desc: 'Secure RBAC: Admin users manage stock and listings while customers browse and purchase.' },
          { icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-900/50', title: 'ACID-Safe Transactions', desc: 'PostgreSQL row-level locking prevents overselling even during concurrent purchase bursts.' },
        ].map(({ icon: Icon, color, bg, title, desc }) => (
          <div key={title} className="card p-8 text-center hover:border-blue-500/50 transition-colors">
            <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
