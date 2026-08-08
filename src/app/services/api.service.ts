import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://plugyard-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  getProducts(params?: {
  recommended?: boolean;
  category?: string;
  search?: string;
  page?: number;
}): Observable<PaginatedResponse<any>> {
  const q: string[] = [];
  if (params?.recommended) q.push('recommended=1');
  if (params?.category) q.push(`category=${encodeURIComponent(params.category)}`);
  if (params?.search) q.push(`search=${encodeURIComponent(params.search)}`);
  if (params?.page) q.push(`page=${params.page}`);

  let url = `${this.baseUrl}/products/`;
  if (q.length) url += '?' + q.join('&');
  return this.http.get<PaginatedResponse<any>>(url);
}

  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/`, order);
  }

  getProduct(id: number) {
  return this.http.get<any>(`${this.baseUrl}/products/${id}/`);
}

  getMyOrders(phone: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/my-orders/?phone=${encodeURIComponent(phone)}`
    );
  }
}