import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../interfaces/customers';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = `${environment.url_api}/customer`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  // JWT del usuario logueado
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'es',
      'Authorization': `JWT ${token}`
    });
  }


  getCustomers(): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/list/`, {}, { headers: this.getHeaders() });
  }

  createCustomer(data: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}/create/`, data, { headers: this.getHeaders() });
  }

  updateCustomer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update/`, data, { headers: this.getHeaders() });
  }

  deleteCustomer(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete/`;
    const body = { id };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }

  getCustomerById(id: number): Observable<any> {
    const url = `${this.apiUrl}/get/`;
    const body = { id };
    return this.http.post(url, body, { headers: this.getHeaders() });
  }


}
