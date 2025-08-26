import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, NotificationService } from '../../../core';
import { Observable } from 'rxjs';
import { User, Notification } from '../../../core/models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  notifications$: Observable<Notification[]>;
  unreadCount = 0;
  showNotifications = false;
  showUserMenu = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.notifications$ = this.notificationService.notificationHistory$;
  }

  ngOnInit(): void {
    this.notifications$.subscribe(notifications => {
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
