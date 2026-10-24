import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, PackagePlus } from 'lucide-react';
import { Vehicle } from '../../types';
import { useRestockVehicle } from '../../hooks/useVehicles';

const schema = z.object({
  quantity: z.number({ coerce: true }).int().positive('Must be a positive integer'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
}

export const RestockModal: React.FC<Props> = ({ vehicle, onClose }) => {
  const restock = useRestockVehicle();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 5 },
  });

  const onSubmit = (data: FormData) => {
    restock.mutate({ vehicleId: vehicle.id, quantity: data.quantity, notes: data.notes }, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <PackagePlus className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Restock Inventory</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-400">Vehicle</p>
            <p className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</p>
            <p className="text-sm text-slate-400 mt-1">Current Stock: <span className="text-emerald-400 font-bold">{vehicle.quantity}</span></p>
          </div>
          <div>
            <label className="label">Restock Quantity *</label>
            <input type="number" {...register('quantity', { valueAsNumber: true })} className="input" min={1} />
            {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="label">Notes (Optional)</label>
            <textarea {...register('notes')} className="input h-20 resize-none" placeholder="Monthly restock..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={restock.isPending} className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700">
              {restock.isPending ? 'Restocking...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
