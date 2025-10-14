import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../interfaces/customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = `${environment.url_api}/customer`;

  constructor(private http: HttpClient) { }

  // JWT del usuario logueado
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'es',
      'Authorization': `JWT ${token}`
    });
  }

  // Listado de los clientes
  getCustomers(): Observable<Customer[]> {
    return this.http.post<Customer[]>(`${this.baseUrl}/list/`, {}, { headers: this.getAuthHeaders() });
  }



  /** 🔹 Obtener un cliente por ID (usa POST con body { id }) */
  getCustomerById(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/get/`, { id }, { headers: this.getAuthHeaders() });
  }

  /** 🔹 Crear un cliente */
  createCustomer(data: Customer): Observable<any> {
    return this.http.post(`${this.baseUrl}/create/`, data, { headers: this.getAuthHeaders() });
  }

  /** 🔹 Actualizar un cliente */
  updateCustomer(data: Customer): Observable<any> {
    return this.http.post(`${this.baseUrl}/update/`, data, { headers: this.getAuthHeaders() });
  }

  /** 🔹 Eliminar un cliente (POST con id) */
  deleteCustomer(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete/`, { id }, { headers: this.getAuthHeaders() });
  }
}
