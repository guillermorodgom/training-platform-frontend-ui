import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add authentication token if available
    const token = this.authService.getToken();
    if (token && !request.url.includes('/auth/login')) {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Unauthorized - redirect to login
          this.authService.logout();
          this.notificationService.showError(
            'Sesión Expirada',
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
          );
        } else if (error.status === 403) {
          // Forbidden
          this.notificationService.showError(
            'Acceso Denegado',
            'No tienes permisos para realizar esta acción.'
          );
        } else if (error.status >= 500) {
          // Server error
          this.notificationService.showError(
            'Error del Servidor',
            'Ha ocurrido un error interno. Por favor, intenta nuevamente.'
          );
        } else if (error.status === 0) {
          // Network error
          this.notificationService.showError(
            'Error de Conexión',
            'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
          );
        }
        
        return throwError(error);
      })
    );
  }
}