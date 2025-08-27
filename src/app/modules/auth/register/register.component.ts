import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../core/services/register.service';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest } from '../../../core/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['estudiante']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      return null;
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = {
        nombre: this.registerForm.value.nombre,
        correo: this.registerForm.value.correo,
        password: this.registerForm.value.password,
        rol: this.registerForm.value.rol
      };

      console.log('RegisterComponent: Starting registration with data:', registerData);
      
      this.registerService.registerUser(registerData).subscribe({
        next: (response) => {
          console.log('RegisterComponent: Registration successful, response:', response);
          this.isLoading = false;
          
          if (response.success) {
            console.log('RegisterComponent: Success confirmed, redirecting to login');
            // Mostrar mensaje de éxito y redirigir al login
            this.showSuccessAndRedirect(registerData.correo);
          } else {
            console.log('RegisterComponent: Registration failed, response indicates failure');
            this.errorMessage = response.message || 'Error al registrar usuario';
          }
        },
        error: (error) => {
          console.log('RegisterComponent: Registration error:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al registrar usuario';
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private showSuccessAndRedirect(email: string): void {
    console.log('RegisterComponent: showSuccessAndRedirect called with email:', email);
    
    // Limpiar el formulario
    this.registerForm.reset({
      rol: 'estudiante' // Mantener el rol por defecto
    });
    
    // Mostrar mensaje temporal de éxito
    const successMessage = `¡Registro exitoso! Tu cuenta ha sido creada correctamente.`;
    
    // Usar setTimeout para dar tiempo a que se procese la respuesta
    setTimeout(() => {
      // Mostrar notificación temporal
      alert(successMessage + ' Serás redirigido al login para iniciar sesión.');
      
      // Redirigir al login después del alert
      this.router.navigate(['/auth/login'], {
        queryParams: { 
          registered: 'true',
          email: email 
        }
      });
    }, 100);
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Correo no válido';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      'nombre': 'Nombre',
      'correo': 'Correo',
      'password': 'Contraseña',
      'confirmPassword': 'Confirmar contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}