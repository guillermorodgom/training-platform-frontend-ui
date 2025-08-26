import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../../core/models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() collapsed = false;
  currentUser$: Observable<User | null>;
  
  menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      route: '/dashboard',
      roles: ['admin', 'instructor', 'student']
    },
    {
      label: 'Cursos',
      icon: '📚',
      route: '/courses',
      roles: ['admin', 'instructor', 'student']
    },
    {
      label: 'Mis Cursos',
      icon: '🎓',
      route: '/my-courses',
      roles: ['student']
    },
    {
      label: 'Crear Curso',
      icon: '➕',
      route: '/courses/new',
      roles: ['admin', 'instructor']
    },
    {
      label: 'Insignias',
      icon: '🏅',
      route: '/badges',
      roles: ['admin', 'instructor', 'student']
    },
    {
      label: 'Mi Perfil',
      icon: '👤',
      route: '/profile',
      roles: ['admin', 'instructor', 'student']
    },
    {
      label: 'Usuarios',
      icon: '👥',
      route: '/admin/users',
      roles: ['admin']
    },
    {
      label: 'Reportes',
      icon: '📈',
      route: '/admin/reports',
      roles: ['admin']
    },
    {
      label: 'Configuración',
      icon: '⚙️',
      route: '/settings',
      roles: ['admin', 'instructor', 'student']
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

  hasAccess(roles: string[], userRole?: string): boolean {
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
