import { Component, OnInit } from '@angular/core';
import { AuthService, CourseService, BadgeService } from '../../../core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, Course, Badge } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  recentCourses$: Observable<Course[]>;
  userBadges$: Observable<Badge[]>;
  
  stats = {
    coursesCompleted: 12,
    coursesInProgress: 3,
    totalHours: 48,
    currentStreak: 5,
    totalBadges: 8,
    ranking: 15
  };

  progressData = [
    { module: 'Frontend', completed: 75, total: 100 },
    { module: 'Backend', completed: 45, total: 100 },
    { module: 'DevOps', completed: 30, total: 100 },
    { module: 'Cloud', completed: 60, total: 100 }
  ];

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private badgeService: BadgeService
  ) {
    this.user$ = this.authService.currentUser$;
    this.recentCourses$ = this.courseService.getCourses().pipe(
      map(courses => courses.slice(0, 4))
    );
    this.userBadges$ = this.badgeService.getUserBadges();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load additional dashboard data
  }

  getProgressPercentage(completed: number, total: number): number {
    return Math.round((completed / total) * 100);
  }

  getStreakIcon(): string {
    if (this.stats.currentStreak >= 7) return '🔥';
    if (this.stats.currentStreak >= 3) return '⭐';
    return '✨';
  }
}
