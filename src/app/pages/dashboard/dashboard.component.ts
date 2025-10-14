import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  customers: any[] = [];
  customerForm!: FormGroup;
  editing = false;

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

  saveCustomer() {
    if (this.customerForm.invalid) return;

    const data = this.customerForm.value;

    const request = this.editing
      ? this.customerService.updateCustomer(data)
      : this.customerService.createCustomer(data);

    request.subscribe({
      next: () => {
        this.loadCustomers();
        this.cancelEdit();
      },
      error: err => console.error(err)
    });
  }

  editCustomer(customer: any) {
    this.editing = true;
    this.customerForm.patchValue(customer);
  }

  deleteCustomer(id: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => this.loadCustomers(),
        error: err => console.error(err)
      });
    }
  }

  cancelEdit() {
    this.editing = false;
    this.customerForm.reset();
  }
}
