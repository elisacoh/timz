export type Role = 'admin' | 'pro' | 'client';

export interface Address {
  street?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface BaseUser {
  id: string;
  email: string;
  full_name: string;
  roles: Role[];
  phone?: string;
  address?: Address;
}

export interface ClientUser extends BaseUser {
  roles: ['client'];
}

export interface ProUser extends BaseUser {
  roles: ['pro'];
  business_name?: string;
  website?: string;
}

export interface AdminUser extends BaseUser {
  roles: ['admin'];
}

export interface ClientProUser extends BaseUser {
  roles: ['client', 'pro'];
  business_name?: string;
  website?: string;
}

// export type User = ClientUser | ProUser | AdminUser | ClientProUser;

export interface User {
  id: string;
  email: string;
  full_name: string;
  roles: Role[];
}

export interface Service {
  id: string;
  title: string;
  duration: number;
  price: number;
  options?: ServiceOption[];
  proId: string;
}

export interface ServiceOption {
  id: string;
  title: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ServiceGroup {
  id: string;
  name: string;
  services: string[];
  proId: string;
}