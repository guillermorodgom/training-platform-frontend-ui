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
      roles: [UserRole.PROFESOR, UserRole.ESTUDIANTE]
    },
    {
      label: 'Cursos',
      icon: '📚',
      route: '/courses',
      roles: [UserRole.PROFESOR, UserRole.ESTUDIANTE]
    },
    {
      label: 'Mis Cursos',
      icon: '🎓',
      route: '/courses/mis-cursos',
      roles: [UserRole.ESTUDIANTE]
    },
    {
      label: 'Crear Curso',
      icon: '➕',
      route: '/courses/new',
      roles: [UserRole.PROFESOR]
    },
    {
      label: 'Insignias',
      icon: '🏅',
      route: '/badges',
      roles: [UserRole.PROFESOR, UserRole.ESTUDIANTE]
    },
    {
      label: 'Mi Perfil',
      icon: '👤',
      route: '/profile',
      roles: [UserRole.PROFESOR, UserRole.ESTUDIANTE]
    },
    {
      label: 'Gestionar Estudiantes',
      icon: '👥',
      route: '/manage/students',
      roles: [UserRole.PROFESOR]
    },
    {
      label: 'Reportes',
      icon: '📈',
      route: '/reports',
      roles: [UserRole.PROFESOR]
    },
    {
      label: 'Configuración',
      icon: '⚙️',
      route: '/settings',
      roles: [UserRole.PROFESOR, UserRole.ESTUDIANTE]
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
