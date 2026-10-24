import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { PaginatedVehicles, Vehicle } from '../types';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: object) => [...vehicleKeys.lists(), filters] as const,
  detail: (id: string) => [...vehicleKeys.all, 'detail', id] as const,
};

export const useVehicles = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: async () => {
      const res = await api.get<{ data: PaginatedVehicles }>('/vehicles', { params });
      return res.data.data;
    },
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: async () => {
      const res = await api.get<{ data: { vehicle: Vehicle } }>(`/vehicles/${id}`);
      return res.data.data.vehicle;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Vehicle> & { price: number; quantity: number }) => {
      const res = await api.post<{ data: { vehicle: Vehicle } }>('/vehicles', data);
      return res.data.data.vehicle;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle listing created! 🚗');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create vehicle'),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vehicle> }) => {
      const res = await api.put<{ data: { vehicle: Vehicle } }>(`/vehicles/${id}`, data);
      return res.data.data.vehicle;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle updated successfully!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/vehicles/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success('Vehicle removed from inventory');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Delete failed'),
  });
};

export const usePurchaseVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vehicleId: string) => {
      const res = await api.post(`/vehicles/${vehicleId}/purchase`);
      return res.data.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success(`🎉 Purchase successful! ${data.remainingQuantity} units remaining.`);
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Purchase failed';
      const isOutOfStock = err.response?.status === 409;
      toast.error(isOutOfStock ? '😞 This vehicle is out of stock!' : message);
    },
  });
};

export const useRestockVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ vehicleId, quantity, notes }: { vehicleId: string; quantity: number; notes?: string }) => {
      const res = await api.post(`/vehicles/${vehicleId}/restock`, { quantity, notes });
      return res.data.data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: vehicleKeys.all });
      toast.success(data.message || 'Inventory restocked! 📦');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Restock failed'),
  });
};
