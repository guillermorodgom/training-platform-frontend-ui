import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Notification, Badge } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();
  
  private notificationHistorySubject = new BehaviorSubject<Notification[]>([]);
  public notificationHistory$ = this.notificationHistorySubject.asObservable();

  constructor() {}

  showNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    const currentHistory = this.notificationHistorySubject.value;
    this.notificationHistorySubject.next([newNotification, ...currentHistory]);
    this.notificationSubject.next(newNotification);
  }

  showSuccess(title: string, message: string): void {
    this.showNotification({
      type: 'success',
      title,
      message
    });
  }

  showError(title: string, message: string): void {
    this.showNotification({
      type: 'error',
      title,
      message
    });
  }

  showWarning(title: string, message: string): void {
    this.showNotification({
      type: 'warning',
      title,
      message
    });
  }

  showInfo(title: string, message: string): void {
    this.showNotification({
      type: 'info',
      title,
      message
    });
  }

  showBadgeNotification(badge: Badge): void {
    this.showNotification({
      type: 'badge',
      title: '¡Nueva Insignia Desbloqueada!',
      message: `Has ganado la insignia "${badge.name}" - ${badge.description}`,
      icon: badge.icon,
      actionUrl: '/badges'
    });
  }

  getNotificationHistory(): Notification[] {
    return this.notificationHistorySubject.value;
  }

  markAsRead(notificationId: string): void {
    const notifications = this.notificationHistorySubject.value;
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationHistorySubject.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const notifications = this.notificationHistorySubject.value;
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    this.notificationHistorySubject.next(updatedNotifications);
  }

  clearAll(): void {
    this.notificationHistorySubject.next([]);
  }

  getUnreadCount(): number {
    return this.notificationHistorySubject.value.filter(n => !n.read).length;
  }
}