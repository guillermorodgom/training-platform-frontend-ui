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
  private apiUrl = `${environment.apiUrl}/badges`;
  private userBadgesSubject = new BehaviorSubject<Badge[]>([]);
  public userBadges$ = this.userBadgesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/usuario`).pipe(
      tap(badges => this.userBadgesSubject.next(badges))
    );
  }

  getAllBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(this.apiUrl);
  }

  getBadgeById(id: number): Observable<Badge> {
    return this.http.get<Badge>(`${this.apiUrl}/${id}`);
  }

  awardBadge(badgeId: number): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/otorgar/${badgeId}`, {}).pipe(
      tap(() => this.refreshUserBadges())
    );
  }

  getAvailableBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/disponibles`);
  }

  private refreshUserBadges(): void {
    this.getUserBadges().subscribe();
  }

  getBadgesByCategory(category: string): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}?category=${category}`);
  }

  getBadgesByRarity(rarity: string): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}?rarity=${rarity}`);
  }

  getUserTotalPoints(): Observable<number> {
    return new Observable(observer => {
      this.getUserBadges().subscribe(badges => {
        const totalPoints = badges.reduce((sum, badge) => sum + (badge.points || 0), 0);
        observer.next(totalPoints);
        observer.complete();
      });
    });
  }

  hasEarnedBadge(badgeId: number): Observable<boolean> {
    return new Observable(observer => {
      this.userBadges$.subscribe(badges => {
        const hasBadge = badges.some(badge => badge.id === badgeId);
        observer.next(hasBadge);
        observer.complete();
      });
    });
  }
}