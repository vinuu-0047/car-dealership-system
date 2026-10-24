import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Edit3 } from 'lucide-react';
import { Vehicle } from '../../types';
import { useUpdateVehicle } from '../../hooks/useVehicles';

const schema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  year: z.number({ coerce: true }).int(),
  price: z.number({ coerce: true }).positive(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

export const EditVehicleModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const update = useUpdateVehicle();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      year: vehicle.year,
      price: Number(vehicle.price),
    },
  });

  const onSubmit = (data: FormData) => {
    update.mutate({ id: vehicle.id, data }, { onSuccess: () => onClose() });
  };

  const CATEGORIES = ['Sedan', 'SUV', 'Truck', 'Sports', 'Electric', 'Hybrid'];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Edit3 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">Edit Vehicle</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Make *</label>
              <input {...register('make')} className="input" />
              {errors.make && <p className="text-red-400 text-xs mt-1">{errors.make.message}</p>}
            </div>
            <div>
              <label className="label">Model *</label>
              <input {...register('model')} className="input" />
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
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Price (USD) *</label>
            <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={update.isPending} className="btn-primary flex-1">
              {update.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
