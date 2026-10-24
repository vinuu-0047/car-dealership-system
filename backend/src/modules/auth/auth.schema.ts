import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name required'),
  role: z.enum(['CUSTOMER', 'ADMIN']).default('CUSTOMER'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
