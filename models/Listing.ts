// Listing Schema Interface
export interface IListing {
  _id?: string;
  title: string;
  category: string;
  price: number;
  location: string;
  description: string;
  images: string[];
  sellerId?: string;
  sellerName?: string;
  sellerEmail?: string;
  status: 'active' | 'sold' | 'deleted';
  views?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Validation function
export function validateListing(data: Partial<IListing>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (!data.price || data.price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push('Location is required');
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  if (!data.images || data.images.length === 0) {
    errors.push('At least one image is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Default listing object creator
export function createListing(data: Partial<IListing>): IListing {
  return {
    title: data.title || '',
    category: data.category || '',
    price: data.price || 0,
    location: data.location || '',
    description: data.description || '',
    images: data.images || [],
    sellerId: data.sellerId,
    sellerName: data.sellerName,
    sellerEmail: data.sellerEmail,
    status: data.status || 'active',
    views: data.views || 0,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  };
}

// Listing categories
export const LISTING_CATEGORIES = [
  'Electronics',
  'Furniture',
  'Vehicles',
  'Books',
  'Misc'
] as const;

// Listing status types
export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  DELETED: 'deleted'
} as const;
