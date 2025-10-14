import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})


export class AuthService {
  private baseUrl = environment.url_api;
  private tokenKey = 'token';

  private _isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this._isAuthenticated$.asObservable();

  constructor(private http: HttpClient) { }


  /* ---------------------------------- Login --------------------------------- */
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/login/`;

    return this.http.post<{ token: string }>(url, { email, password }).pipe(
      tap(res => {
        if (res?.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this._isAuthenticated$.next(true);
        }
      })
    );
  }

  /* ------------------------------ Cerrar sesion ----------------------------- */
  logout(): Observable<any> {
    const url = `${this.baseUrl}/auth/logout/`;
    const headers = this.getAuthHeaders();
    return this.http.post(url, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        this._isAuthenticated$.next(false);
      })
    );
  }

  /* --------------------------------- perfil --------------------------------- */
  getUserProfile(): Observable<any> {
    const url = `${this.baseUrl}/auth/user/profile/`;
    const headers = this.getAuthHeaders();
    return this.http.get(url, { headers });
  }


  /* --------------------------- funciones del token -------------------------- */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

}
