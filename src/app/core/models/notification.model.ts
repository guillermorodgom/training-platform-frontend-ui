export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'badge';
  title: string;
  message: string;
  timestamp: Date;
  read?: boolean;
  actionUrl?: string;
  icon?: string;
}