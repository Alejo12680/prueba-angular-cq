import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';



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
  customerCreateForm!: FormGroup;
  private editModal!: Modal;

  constructor(private fb: FormBuilder, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.loadCustomers();

    this.customerCreateForm = this.fb.group({
      tax_id: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      name: ['', Validators.required],
      address: ['', Validators.required],
      contact_email: ['', [Validators.required, Validators.email]],
      enabled: [true]
    });

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
    if (this.customerCreateForm.invalid) {
      this.markFormGroupTouched(this.customerCreateForm);
      return;
    }
    const data = this.customerCreateForm.value;

    this.customerService.createCustomer(data).subscribe({
      next: () => {
        alert('Cliente creado con éxito');
        this.loadCustomers();
        this.customerCreateForm.reset({ enabled: true });
      },
      error: err => {
        console.error(err);
        alert('Error al crear cliente');
      }
    });
  }


  editCustomer(c: any) {
    this.customerForm.reset();

    // Mostrar modal primero
    const modalElement = document.getElementById('editModal');
    if (modalElement) {
      this.editModal = new Modal(modalElement);
      this.editModal.show();
    }

    // Llamar al servicio por ID
    this.customerService.getCustomerById(c.id).subscribe({
      next: (res) => {
        this.customerForm.patchValue(res);
      },
      error: (err) => {
        console.error('Error al obtener cliente:', err);
        alert('Error al cargar los datos del cliente');
      }
    });
  }

  updateCustomer() {
    if (this.customerForm.invalid) {
      this.markFormGroupTouched(this.customerForm);
      return;
    }

    const data = this.customerForm.value;

    this.customerService.updateCustomer(data).subscribe({
      next: () => {
        alert('Cliente actualizado con éxito');
        this.loadCustomers();
        this.customerForm.reset();
        this.closeModal();
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

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private closeModal() {
    if (this.editModal) {
      this.editModal.hide();
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(b => b.remove());
    }
  }


}
