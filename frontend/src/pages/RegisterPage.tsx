import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Mail, Lock, User, Shield, ArrowLeft } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  role: z.enum(['CUSTOMER', 'ADMIN']),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CUSTOMER' },
  });

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
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Create Account</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Register to start purchasing vehicles</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input {...register('fullName')} className="input pl-10" placeholder="Vikram Sharma" />
              </div>
              {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

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
                <input {...register('password')} type="password" className="input pl-10" placeholder="Min 8 characters" />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Account Role</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-amber-500 transition-colors has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                  <input type="radio" value="CUSTOMER" {...register('role')} className="text-amber-600 focus:ring-amber-500" />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Customer</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer hover:border-amber-500 transition-colors has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                  <input type="radio" value="ADMIN" {...register('role')} className="text-amber-600 focus:ring-amber-500" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Admin</span>
                  </div>
                </label>
              </div>
            </div>

            <button type="submit" disabled={registerMutation.isPending} className="btn-primary w-full py-3 text-sm mt-3">
              {registerMutation.isPending ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <p className="text-center text-zinc-500 dark:text-zinc-400 text-xs mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
