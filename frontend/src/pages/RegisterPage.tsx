import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Car, Mail, Lock, User, Shield } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';

const schema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Min 8 characters'),
  role: z.enum(['CUSTOMER', 'ADMIN']),
});

type FormData = z.infer<typeof schema>;

export const RegisterPage: React.FC = () => {
  const register2 = useRegister();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'CUSTOMER' },
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-slate-400 mt-2">Join AutoElite Dealership</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit((data) => register2.mutate(data))} className="space-y-5">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input {...register('fullName')} className="input pl-10" placeholder="John Doe" />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
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
                <input {...register('password')} type="password" className="input pl-10" placeholder="Min 8 characters" />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer hover:border-blue-500 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-950/30">
                  <input type="radio" value="CUSTOMER" {...register('role')} className="text-blue-500" />
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium">Customer</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer hover:border-yellow-500 transition-colors has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-950/30">
                  <input type="radio" value="ADMIN" {...register('role')} className="text-yellow-500" />
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium">Admin</span>
                  </div>
                </label>
              </div>
            </div>
            <button type="submit" disabled={register2.isPending} className="btn-primary w-full py-3 text-base">
              {register2.isPending ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
