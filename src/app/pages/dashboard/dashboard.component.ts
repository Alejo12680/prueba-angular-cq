import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  customers: any[] = [];
  customerForm!: FormGroup;

  constructor(private fb: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();

    this.customerForm = this.fb.group({
      id: [''],
      tax_id: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      contact_email: ['', [Validators.required, Validators.email]],
      enabled: [true]
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: res => this.customers = res,
      error: err => console.error(err)
    });
  }

  // funcion para crear Cliente
  saveCustomer() {
    if (this.customerForm.invalid) return;
    const data = this.customerForm.value;

    this.customerService.createCustomer(data).subscribe({
      next: () => {
        alert('Cliente creado con éxito');
        this.loadCustomers();
        this.customerForm.reset();
      },
      error: err => {
        console.error(err);
        alert('Error al crear cliente');
      }
    });
  }


  editCustomer(c: any) {
    this.customerForm.patchValue(c);
  }

  updateCustomer() {
    if (this.customerForm.invalid) return;
    const data = this.customerForm.value;

    this.customerService.updateCustomer(data).subscribe({
      next: () => {
        alert('Cliente actualizado con éxito');
        this.loadCustomers();
        this.customerForm.reset();
      },
      error: err => {
        console.error(err);
        alert('Error al actualizar cliente');
      }
    });
  }

  deleteCustomer(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          alert('Cliente eliminado con éxito');
          this.loadCustomers();
        },
        error: err => {
          console.error('Error al eliminar cliente:', err);
          alert('Error al eliminar cliente');
        }
      });
    }
  }


}
