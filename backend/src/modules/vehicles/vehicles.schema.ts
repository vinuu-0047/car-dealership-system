import { z } from 'zod';

export const CreateVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  category: z.string().min(1, 'Category is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().nonnegative('Quantity cannot be negative').default(0),
  vin: z.string().min(5, 'VIN required'),
  imageUrl: z.string().url().optional(),
});

export const UpdateVehicleSchema = CreateVehicleSchema.partial().omit({ vin: true });

export const SearchQuerySchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const RestockSchema = z.object({
  quantity: z.number().int().positive('Restock quantity must be a positive integer'),
  notes: z.string().optional(),
});

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>;
export type SearchQueryDto = z.infer<typeof SearchQuerySchema>;
export type RestockDto = z.infer<typeof RestockSchema>;
