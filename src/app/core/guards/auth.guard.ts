import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth(route);
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  private checkAuth(route?: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && this.authService.isAuthenticated()) {
          // Check role-based access if required
          if (route?.data?.['role']) {
            const requiredRole = route.data['role'];
            if (user.role !== requiredRole) {
              this.router.navigate(['/dashboard']);
              return false;
            }
          }
          return true;
        } else {
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}