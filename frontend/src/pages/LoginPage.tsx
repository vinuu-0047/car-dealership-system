import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Lock, Mail } from 'lucide-react';
import { useLogin } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export const LoginPage: React.FC = () => {
  const login = useLogin();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Car className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-slate-400 mt-2">Sign in to AutoElite Dealership</p>
        </div>

        {/* Demo Quick Login */}
        <div className="card p-4 mb-6 border-blue-500/30">
          <p className="text-xs text-slate-400 text-center mb-3 font-medium uppercase tracking-wide">⚡ Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => loginAsDemo('admin')} className="text-sm py-2.5 px-4 bg-yellow-600/20 border border-yellow-600/40 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors font-medium">
              🛡️ Login as Admin
            </button>
            <button type="button" onClick={() => loginAsDemo('customer')} className="text-sm py-2.5 px-4 bg-blue-600/20 border border-blue-600/40 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors font-medium">
              👤 Login as Customer
            </button>
          </div>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => login.mutate(data))} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('email')} type="email" className="input pl-10" placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('password')} type="password" className="input pl-10" placeholder="••••••••" />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={login.isPending} className="btn-primary w-full py-3 text-base">
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
