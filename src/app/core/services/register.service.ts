import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RegisterRequest, User, UserRole } from '../models';

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string | null;
}

// Interface para el request que espera el backend
export interface BackendRegisterRequest {
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario en el sistema
   * @param registerData - Datos del usuario para registro
   * @returns Observable con la respuesta del servidor
   */
  registerUser(registerData: RegisterRequest): Observable<RegisterResponse> {
    console.log('RegisterService: registerUser called with:', registerData);
    
    // Transformar los datos del frontend al formato que espera el backend
    const backendRequest: BackendRegisterRequest = {
      username: registerData.correo, // Usar el correo como username
      password: registerData.password,
      role: this.mapRoleToBackend(registerData.rol || UserRole.ESTUDIANTE)
    };

    console.log('RegisterService: Sending to backend:', backendRequest);

    return this.http.post(`${this.apiUrl}/register`, backendRequest, { 
      ...this.httpOptions,
      responseType: 'text' as 'json' // Aceptar respuesta como texto inicialmente
    })
      .pipe(
        map((response: any) => {
          console.log('RegisterService: Raw backend response:', response);
          
          // Intentar parsear como JSON si es posible
          let parsedResponse: any = {};
          try {
            parsedResponse = JSON.parse(response);
            console.log('RegisterService: Parsed JSON response:', parsedResponse);
          } catch (e) {
            console.log('RegisterService: Response is not JSON, treating as text:', response);
            parsedResponse = { message: response || 'Usuario registrado exitosamente' };
          }
          
          // Crear el usuario con el formato del frontend
          const user: User = {
            id_usuario: parsedResponse.id || parsedResponse.userId || Date.now(),
            nombre: registerData.nombre,
            correo: registerData.correo,
            rol: registerData.rol || UserRole.ESTUDIANTE,
            fecha_registro: new Date(parsedResponse.createdAt || new Date())
          };

          return {
            success: true,
            message: parsedResponse.message || 'Usuario registrado exitosamente',
            user: user,
            token: parsedResponse.token || parsedResponse.accessToken || null
          } as RegisterResponse;
        }),
        catchError(error => {
          console.error('RegisterService: Error occurred:', error);
          
          // Si el error es de parsing pero el status es 201, es un éxito
          if (error.status === 201 || error.status === 200) {
            console.log('RegisterService: Status indicates success despite parsing error');
            
            // Crear usuario exitoso
            const user: User = {
              id_usuario: Date.now(),
              nombre: registerData.nombre,
              correo: registerData.correo,
              rol: registerData.rol || UserRole.ESTUDIANTE,
              fecha_registro: new Date()
            };

            return new Observable<RegisterResponse>(observer => {
              observer.next({
                success: true,
                message: 'Usuario registrado exitosamente',
                user: user,
                token: null
              });
              observer.complete();
            });
          }
          
          return this.handleError(error);
        })
      );
  }

  /**
   * Mapea el rol del frontend al formato del backend
   * @param frontendRole - Rol en formato del frontend
   * @returns Rol en formato del backend
   */
  private mapRoleToBackend(frontendRole: UserRole): string {
    switch (frontendRole) {
      case UserRole.PROFESOR:
        return 'PROFESOR';
      case UserRole.ESTUDIANTE:
        return 'ESTUDIANTE';
      default:
        return 'ESTUDIANTE';
    }
  }

  /**
   * Valida si un correo electrónico ya existe en el sistema
   * @param email - Correo electrónico a validar
   * @returns Observable<boolean> - true si existe, false si no
   */
  validateEmailExists(email: string): Observable<boolean> {
    // TODO: Implementar validación de email
    // Endpoint: GET /api/auth/validate-email?email=...
    
    console.log('RegisterService: validateEmailExists called with:', email);
    
    // Mock response
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(false); // Por defecto no existe
        observer.complete();
      }, 500);
    });
  }

  /**
   * Obtiene la lista de roles disponibles para registro
   * @returns Observable con los roles disponibles
   */
  getAvailableRoles(): Observable<string[]> {
    // TODO: Implementar obtención de roles desde el backend
    // Endpoint: GET /api/auth/roles
    
    console.log('RegisterService: getAvailableRoles called');
    
    // Mock response con los roles actuales
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(['estudiante', 'profesor']);
        observer.complete();
      }, 300);
    });
  }

  /**
   * Maneja errores de HTTP
   * @param error - Error HTTP
   * @returns Observable con error formateado
   */
  private handleError(error: any): Observable<never> {
    console.error('RegisterService Error Details:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      message: error.message,
      url: error.url
    });
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del cliente (red, etc.)
      errorMessage = `Error de conexión: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || error.error || 'Datos de registro inválidos. Verifica la información ingresada.';
          break;
        case 409:
          errorMessage = error.error?.message || error.error || 'El usuario ya está registrado con este correo electrónico.';
          break;
        case 422:
          errorMessage = error.error?.message || error.error || 'Los datos proporcionados no son válidos.';
          break;
        case 500:
          errorMessage = error.error?.message || error.error || 'Error interno del servidor. Intenta nuevamente.';
          break;
        case 0:
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          break;
        default:
          const backendMessage = error.error?.message || error.error;
          if (typeof backendMessage === 'string') {
            errorMessage = backendMessage;
          } else {
            errorMessage = `Error del servidor (${error.status}): ${error.statusText || 'Error desconocido'}`;
          }
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}