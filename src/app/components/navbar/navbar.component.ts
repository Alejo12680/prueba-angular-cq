import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isAuthenticated = false;

  constructor( private authService: AuthService ) {
    this.authService.isAuthenticated$.subscribe(
      (value) => (this.isAuthenticated = value)
    );
  }

  logout() {
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    });
  }

}
