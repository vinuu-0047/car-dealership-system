import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loginAsDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setValue('email', 'admin@cardealership.com');
      setValue('password', 'Admin@12345');
    } else {
      setValue('email', 'customer@example.com');
      setValue('password', 'Customer@12345');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-600 dark:hover:text-amber-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Vehicle Catalog
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-600/20 text-white">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Welcome Back</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Sign in to your AutoElite account</p>
        </div>

        {/* Demo Quick Login */}
        <div className="card p-4 mb-6 border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/20">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center mb-3 font-bold uppercase tracking-wider">
            ⚡ One-Click Reviewer Access
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => loginAsDemo('admin')}
              className="text-xs py-2.5 px-3 bg-amber-600/10 border border-amber-600/30 text-amber-700 dark:text-amber-300 rounded-lg hover:bg-amber-600/20 transition-all font-bold"
            >
              🛡️ Admin Demo
            </button>
            <button
              type="button"
              onClick={() => loginAsDemo('customer')}
              className="text-xs py-2.5 px-3 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all font-bold"
            >
              👤 Customer Demo
            </button>
          </div>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input {...register('email')} type="email" className="input pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input {...register('password')} type="password" className="input pl-10" placeholder="••••••••" />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={login.isPending} className="btn-primary w-full py-3 text-sm mt-2">
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-zinc-500 dark:text-zinc-400 text-xs mt-6">
            New to AutoElite?{' '}
            <Link to="/register" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
