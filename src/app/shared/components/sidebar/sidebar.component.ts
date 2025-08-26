import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../../core/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  currentUser$: Observable<User | null>;
  UserRole = UserRole; // Exponer enum al template
  
  menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
    },
    {
      label: 'Cursos',
      icon: '📚',
      route: '/courses',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
    },
    {
      label: 'Mis Cursos',
      icon: '🎓',
      route: '/my-courses',
      roles: [UserRole.STUDENT]
    },
    {
      label: 'Crear Curso',
      icon: '➕',
      route: '/courses/new',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR]
    },
    {
      label: 'Insignias',
      icon: '🏅',
      route: '/badges',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
    },
    {
      label: 'Mi Perfil',
      icon: '👤',
      route: '/profile',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
    },
    {
      label: 'Usuarios',
      icon: '👥',
      route: '/admin/users',
      roles: [UserRole.ADMIN]
    },
    {
      label: 'Reportes',
      icon: '📈',
      route: '/admin/reports',
      roles: [UserRole.ADMIN]
    },
    {
      label: 'Configuración',
      icon: '⚙️',
      route: '/settings',
      roles: [UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT]
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  hasAccess(roles: UserRole[], userRole?: UserRole): boolean {
    return userRole ? roles.includes(userRole) : false;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  trackByRoute(index: number, item: any): string {
    return item.route;
  }
}
