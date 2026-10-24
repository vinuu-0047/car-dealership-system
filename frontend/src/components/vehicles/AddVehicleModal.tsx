import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, PlusCircle } from 'lucide-react';
import { useCreateVehicle } from '../../hooks/useVehicles';

const schema = z.object({
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  category: z.string().min(1, 'Required'),
  year: z.number({ coerce: true }).int().min(1990).max(2026),
  price: z.number({ coerce: true }).positive('Must be positive'),
  quantity: z.number({ coerce: true }).int().nonnegative(),
  vin: z.string().min(5, 'VIN required'),
  imageUrl: z.string().url('Must be valid URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
}

export const AddVehicleModal: React.FC<Props> = ({ onClose }) => {
  const create = useCreateVehicle();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { year: 2024, quantity: 5, category: 'SUV' },
  });

  const onSubmit = (data: FormData) => {
    create.mutate(data as any, { onSuccess: () => onClose() });
  };

  const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Electric', '4x4 Off-Road'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Add New Vehicle</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Make (e.g. Tata, Mahindra) *</label>
              <input {...register('make')} className="input" placeholder="Mahindra" />
              {errors.make && <p className="text-rose-500 text-xs mt-1">{errors.make.message}</p>}
            </div>
            <div>
              <label className="label">Model *</label>
              <input {...register('model')} className="input" placeholder="Thar" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Year *</label>
              <input type="number" {...register('year', { valueAsNumber: true })} className="input" />
            </div>
            <div>
              <label className="label">Category *</label>
              <select {...register('category')} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price in INR (₹) *</label>
              <input type="number" step="1000" {...register('price', { valueAsNumber: true })} className="input" placeholder="1550000" />
              {errors.price && <p className="text-rose-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="label">Initial Stock Quantity *</label>
              <input type="number" {...register('quantity', { valueAsNumber: true })} className="input" />
            </div>
          </div>
          <div>
            <label className="label">VIN / Chassis Number *</label>
            <input {...register('vin')} className="input font-mono" placeholder="IND-MAH-001" />
            {errors.vin && <p className="text-rose-500 text-xs mt-1">{errors.vin.message}</p>}
          </div>
          <div>
            <label className="label">Photo URL (Optional)</label>
            <input {...register('imageUrl')} className="input" placeholder="https://images.unsplash.com/..." />
            {errors.imageUrl && <p className="text-rose-500 text-xs mt-1">{errors.imageUrl.message}</p>}
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={create.isPending} className="btn-primary flex-1">
              {create.isPending ? 'Creating...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
