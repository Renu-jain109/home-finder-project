import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  // Get all properties with optional filters
  getAllProperties(filters?: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    category?: string;
    state?: string;
  }): Observable<ApiResponse> {
    let params = new HttpParams();
    if (filters) {
      if (filters.location) params = params.set('location', filters.location);
      if (filters.type) params = params.set('type', filters.type);
      if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
      if (filters.bedrooms) params = params.set('bedrooms', filters.bedrooms.toString());
      if (filters.category) params = params.set('category', filters.category);
      if (filters.state) params = params.set('state', filters.state);
    }
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  // Get a single property by ID
  getPropertyById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  // Create a new property
  createProperty(property: Property): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, property);
  }

  // Update a property
  updateProperty(id: string, property: Partial<Property>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, property);
  }

  // Delete a property
  deleteProperty(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  // Get properties by owner ID
  getMyProperties(ownerId: string): Observable<ApiResponse> {
    let params = new HttpParams().set('ownerId', ownerId);
    return this.http.get<ApiResponse>(`${this.apiUrl}/my`, { params });
  }
}
