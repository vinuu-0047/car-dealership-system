export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  year: number;
  price: string | number;
  quantity: number;
  vin: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedVehicles {
  vehicles: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export type VehicleCategory = 'Sedan' | 'SUV' | 'Truck' | 'Sports' | 'Electric' | 'Hybrid' | 'All';
