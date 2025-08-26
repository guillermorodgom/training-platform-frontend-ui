import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Badge } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private apiUrl = `${environment.apiUrl}`;
  private userBadgesSubject = new BehaviorSubject<Badge[]>([]);
  public userBadges$ = this.userBadgesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserBadges(userId?: string): Observable<Badge[]> {
    const url = userId ? `${this.apiUrl}/users/${userId}/badges` : `${this.apiUrl}/user/badges`;
    return this.http.get<Badge[]>(url).pipe(
      tap(badges => this.userBadgesSubject.next(badges))
    );
  }

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges`);
  }

  getBadgeById(id: string): Observable<Badge> {
    return this.http.get<Badge>(`${this.apiUrl}/badges/${id}`);
  }

  awardBadge(badgeId: string, userId: string): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/badges/${badgeId}/award`, { userId }).pipe(
      tap(badge => {
        const currentBadges = this.userBadgesSubject.value;
        this.userBadgesSubject.next([...currentBadges, badge]);
      })
    );
  }

  checkBadgeProgress(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/badge-progress`);
  }

  getBadgesByCategory(category: string): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges/category/${category}`);
  }

  createBadge(badge: Partial<Badge>): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/badges`, badge);
  }

  updateBadge(id: string, updates: Partial<Badge>): Observable<Badge> {
    return this.http.put<Badge>(`${this.apiUrl}/badges/${id}`, updates);
  }

  deleteBadge(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/badges/${id}`);
  }

  getUserStats(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/badge-stats`);
  }
}