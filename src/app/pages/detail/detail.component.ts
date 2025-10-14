import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  customer: any;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCustomerDetail(id);
    } else {
      this.error = 'ID de cliente no válido';
      this.loading = false;
    }
  }

  loadCustomerDetail(id: number): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (data) => {
        this.customer = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle de cliente:', err);
        this.error = 'Error al obtener los datos del cliente';
        this.loading = false;
      }
    });
  }

}
