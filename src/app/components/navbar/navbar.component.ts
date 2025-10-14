import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
    // Escucha cambios del estado global
    this.authService.isAuthenticated$.subscribe((value) => {
      this.isAuthenticated = value;
      this.cdRef.detectChanges();
    });

    // Verifica si ya hay token guardado
    const token = this.authService.getToken();
    if (token) {
      this.isAuthenticated = true;
      this.cdRef.detectChanges();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.authService['_isAuthenticated$'].next(false);
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.authService['_isAuthenticated$'].next(false);
        this.router.navigate(['/login']);
      }
    });
  }
}
