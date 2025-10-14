import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuth = this.authService.isAuthenticated();
    if (isAuth) {
      this.router.navigate(['/clientes']);
      return false;
    }
    return true;
  }
}
