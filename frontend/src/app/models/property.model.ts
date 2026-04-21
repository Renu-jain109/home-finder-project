export interface Property {
  _id?: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: 'Rent' | 'Sale';
  propertyCategory: 'Apartment' | 'House' | 'Villa' | 'Plot' | 'Commercial';
  imageUrl: string;
  description: string;
  contactName: string;
  contactPhone: string;
  isAvailable?: boolean;
  createdAt?: string;
  lat?: number;
  lng?: number;
}

export interface ApiResponse {
  success: boolean;
  count?: number;
  data: Property | Property[];
  message?: string;
}
