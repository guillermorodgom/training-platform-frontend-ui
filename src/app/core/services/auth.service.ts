import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse, RegisterRequest, UserRole } from '../models';
import { environment } from '../../../environments/environment';

// Interface para el request que espera el backend
interface BackendLoginRequest {
  username: string;
  password: string;
}

// Interface para la respuesta del backend
interface BackendLoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/auth`;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Starting login with data:', loginData);
    
    // Transformar los datos del frontend al formato que espera el backend
    const backendRequest: BackendLoginRequest = {
      username: loginData.correo, // Usar el correo como username
      password: loginData.password
    };

    console.log('AuthService: Sending to backend:', backendRequest);

    return this.http.post<BackendLoginResponse>(`${this.apiUrl}/login`, backendRequest, this.httpOptions)
      .pipe(
        map(backendResponse => {
          console.log('AuthService: Backend response:', backendResponse);
          
          // Crear el usuario con los datos disponibles
          const user: User = {
            id_usuario: Date.now(), // Usar timestamp como ID temporal
            nombre: this.extractNameFromEmail(loginData.correo),
            correo: loginData.correo,
            rol: this.mapRoleFromBackend(backendResponse.role),
            fecha_registro: new Date()
          };

          // Guardar en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', backendResponse.token);
          
          // Actualizar el subject
          this.currentUserSubject.next(user);

          // Retornar respuesta en formato del frontend
          const response: LoginResponse = {
            user: user,
            token: backendResponse.token,
            type: 'Bearer'
          };

          console.log('AuthService: Login successful, final response:', response);
          return response;
        }),
        catchError(error => {
          console.error('AuthService: Login error:', error);
          return this.handleLoginError(error);
        })
      );
  }

  /**
   * Extrae un nombre del email para mostrar al usuario
   */
  private extractNameFromEmail(email: string): string {
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1).replace(/[0-9]/g, '');
  }

  /**
   * Mapea el rol del backend al formato del frontend
   */
  private mapRoleFromBackend(backendRole: string): UserRole {
    switch (backendRole.toUpperCase()) {
      case 'PROFESOR':
        return UserRole.PROFESOR;
      case 'ESTUDIANTE':
        return UserRole.ESTUDIANTE;
      default:
        return UserRole.ESTUDIANTE;
    }
  }

  /**
   * Maneja errores de login
   */
  private handleLoginError(error: any): Observable<never> {
    console.error('AuthService Login Error Details:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message,
      url: error.url
    });
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos de login inválidos.';
          break;
        case 403:
          errorMessage = 'Acceso denegado. Tu cuenta puede estar desactivada.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor. Intenta nuevamente.';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor.';
          break;
        default:
          const backendMessage = error.error?.message || error.error;
          if (typeof backendMessage === 'string') {
            errorMessage = backendMessage;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!localStorage.getItem('token');
  }

  register(registerData: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, registerData).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.rol === role;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  refreshUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }
}