// =====================================
// ESTRUCTURA DEL PROYECTO
// =====================================
/*
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── course.service.ts
│   │   │   ├── badge.service.ts
│   │   │   └── notification.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── models/
│   │       ├── user.model.ts
│   │       ├── course.model.ts
│   │       └── badge.model.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   └── badge-display/
│   │   └── pipes/
│   │       └── duration.pipe.ts
│   ├── modules/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── badges/
│   │   ├── profile/
│   │   └── admin/
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
└── environments/
*/

// =====================================
// MODELOS (core/models/)
// =====================================

// user.model.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'instructor' | 'student';
  department: string;
  badges: Badge[];
  enrolledCourses: string[];
  completedCourses: string[];
  profilePicture?: string;
  joinDate: Date;
  lastActive: Date;
}

// course.model.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  moduleType: ModuleType;
  duration: number; // en minutos
  instructor: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  materials: CourseMaterial[];
  prerequisites: string[];
  objectives: string[];
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  enrolledStudents: number;
  completionRate: number;
  badge: Badge;
  chapters: Chapter[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  materials: CourseMaterial[];
  completed?: boolean;
  quiz?: Quiz;
}

export interface CourseMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url: string;
  size?: number;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export enum CourseCategory {
  TECHNICAL = 'Técnico',
  SOFT_SKILLS = 'Habilidades Blandas',
  COMPLIANCE = 'Cumplimiento',
  LEADERSHIP = 'Liderazgo',
  SAFETY = 'Seguridad'
}

export enum ModuleType {
  PROGRAMMING = 'Programación',
  CLOUD = 'Cloud Computing',
  DEVOPS = 'DevOps',
  DATABASE = 'Bases de Datos',
  SECURITY = 'Seguridad',
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  MOBILE = 'Móvil',
  AI_ML = 'IA/ML',
  PROJECT_MANAGEMENT = 'Gestión de Proyectos'
}

// badge.model.ts
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  requirements: BadgeRequirement[];
  earnedDate?: Date;
  courseId?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface BadgeRequirement {
  type: 'course_completion' | 'quiz_score' | 'time_spent' | 'streak';
  value: any;
  description: string;
}

export enum BadgeCategory {
  COMPLETION = 'Completación',
  EXCELLENCE = 'Excelencia',
  SPEED = 'Velocidad',
  CONSISTENCY = 'Consistencia',
  MILESTONE = 'Hito'
}

// =====================================
// SERVICIOS (core/services/)
// =====================================

// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = 'api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    // Simulación - en producción conectar con backend real
    const mockUser: User = {
      id: '1',
      email: email,
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'student',
      department: 'Desarrollo',
      badges: [],
      enrolledCourses: [],
      completedCourses: [],
      joinDate: new Date(),
      lastActive: new Date()
    };

    return of({ user: mockUser, token: 'mock-jwt-token' }).pipe(
      delay(1000),
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }
}

// course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'api/courses';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  // Mock data para demostración
  private mockCourses: Course[] = [
    {
      id: '1',
      title: 'Angular Avanzado',
      description: 'Domina los conceptos avanzados de Angular incluyendo RxJS, State Management y optimización',
      category: CourseCategory.TECHNICAL,
      moduleType: ModuleType.FRONTEND,
      duration: 480,
      instructor: 'María González',
      isInternal: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-20'),
      enrolledStudents: 145,
      completionRate: 78,
      difficulty: 'advanced',
      tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx'],
      prerequisites: ['Angular Básico', 'TypeScript Fundamentos'],
      objectives: [
        'Implementar arquitecturas escalables',
        'Optimizar el rendimiento de aplicaciones',
        'Gestionar estado complejo con NgRx'
      ],
      badge: {
        id: 'b1',
        name: 'Angular Master',
        description: 'Dominio completo de Angular',
        icon: '🅰️',
        color: '#dd0031',
        category: BadgeCategory.COMPLETION,
        requirements: [
          {
            type: 'course_completion',
            value: true,
            description: 'Completar todos los módulos'
          },
          {
            type: 'quiz_score',
            value: 80,
            description: 'Obtener al menos 80% en el examen final'
          }
        ],
        rarity: 'epic',
        points: 500
      },
      materials: [
        {
          id: 'm1',
          name: 'Guía de Arquitectura Angular',
          type: 'pdf',
          url: '/materials/angular-architecture.pdf',
          size: 2548576
        }
      ],
      chapters: [
        {
          id: 'ch1',
          title: 'Arquitectura y Mejores Prácticas',
          description: 'Aprende a estructurar aplicaciones Angular escalables',
          duration: 90,
          materials: [],
          quiz: {
            id: 'q1',
            passingScore: 70,
            timeLimit: 30,
            questions: [
              {
                id: 'q1-1',
                text: '¿Cuál es el propósito principal de los servicios en Angular?',
                options: [
                  'Manejar la lógica de presentación',
                  'Compartir datos y lógica entre componentes',
                  'Definir rutas',
                  'Crear animaciones'
                ],
                correctAnswer: 1,
                explanation: 'Los servicios permiten compartir datos y lógica de negocio entre componentes'
              }
            ]
          }
        }
      ]
    },
    {
      id: '2',
      title: 'DevOps con Docker y Kubernetes',
      description: 'Aprende a containerizar y orquestar aplicaciones en producción',
      category: CourseCategory.TECHNICAL,
      moduleType: ModuleType.DEVOPS,
      duration: 600,
      instructor: 'Carlos Rodríguez',
      isInternal: false,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-15'),
      enrolledStudents: 89,
      completionRate: 65,
      difficulty: 'intermediate',
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud'],
      prerequisites: ['Linux Básico', 'Redes'],
      objectives: [
        'Containerizar aplicaciones con Docker',
        'Desplegar en Kubernetes',
        'Implementar pipelines CI/CD'
      ],
      badge: {
        id: 'b2',
        name: 'DevOps Ninja',
        description: 'Experto en prácticas DevOps',
        icon: '🚀',
        color: '#0db7ed',
        category: BadgeCategory.EXCELLENCE,
        requirements: [
          {
            type: 'course_completion',
            value: true,
            description: 'Completar el curso'
          }
        ],
        rarity: 'rare',
        points: 400
      },
      materials: [],
      chapters: []
    }
  ];

  constructor(private http: HttpClient) {
    this.loadCourses();
  }

  private loadCourses(): void {
    // Simular carga inicial
    this.coursesSubject.next(this.mockCourses);
  }

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCourseById(id: string): Observable<Course | undefined> {
    const course = this.mockCourses.find(c => c.id === id);
    return of(course).pipe(delay(500));
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    const newCourse: Course = {
      ...course as Course,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      enrolledStudents: 0,
      completionRate: 0
    };
    
    this.mockCourses.push(newCourse);
    this.coursesSubject.next(this.mockCourses);
    return of(newCourse).pipe(delay(1000));
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    const index = this.mockCourses.findIndex(c => c.id === id);
    if (index !== -1) {
      this.mockCourses[index] = {
        ...this.mockCourses[index],
        ...updates,
        updatedAt: new Date()
      };
      this.coursesSubject.next(this.mockCourses);
      return of(this.mockCourses[index]).pipe(delay(500));
    }
    throw new Error('Course not found');
  }

  deleteCourse(id: string): Observable<void> {
    this.mockCourses = this.mockCourses.filter(c => c.id !== id);
    this.coursesSubject.next(this.mockCourses);
    return of(void 0).pipe(delay(500));
  }

  enrollInCourse(courseId: string, userId: string): Observable<any> {
    const course = this.mockCourses.find(c => c.id === courseId);
    if (course) {
      course.enrolledStudents++;
      this.coursesSubject.next(this.mockCourses);
    }
    return of({ success: true }).pipe(delay(1000));
  }

  completeCourse(courseId: string, userId: string): Observable<Badge> {
    const course = this.mockCourses.find(c => c.id === courseId);
    if (course && course.badge) {
      const earnedBadge = {
        ...course.badge,
        earnedDate: new Date()
      };
      return of(earnedBadge).pipe(delay(1500));
    }
    throw new Error('Course or badge not found');
  }

  uploadCourseMaterial(courseId: string, file: File): Observable<CourseMaterial> {
    const material: CourseMaterial = {
      id: Date.now().toString(),
      name: file.name,
      type: 'document',
      url: URL.createObjectURL(file),
      size: file.size
    };
    
    const course = this.mockCourses.find(c => c.id === courseId);
    if (course) {
      course.materials.push(material);
      this.coursesSubject.next(this.mockCourses);
    }
    
    return of(material).pipe(delay(2000));
  }
}

// badge.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {
  private userBadgesSubject = new BehaviorSubject<Badge[]>([]);
  public userBadges$ = this.userBadgesSubject.asObservable();

  private allBadges: Badge[] = [
    {
      id: 'b-first',
      name: 'Primer Paso',
      description: 'Completaste tu primer curso',
      icon: '🎯',
      color: '#10b981',
      category: BadgeCategory.MILESTONE,
      requirements: [
        {
          type: 'course_completion',
          value: 1,
          description: 'Completar 1 curso'
        }
      ],
      rarity: 'common',
      points: 100
    },
    {
      id: 'b-streak',
      name: 'Constancia',
      description: '7 días seguidos de aprendizaje',
      icon: '🔥',
      color: '#f59e0b',
      category: BadgeCategory.CONSISTENCY,
      requirements: [
        {
          type: 'streak',
          value: 7,
          description: 'Mantener una racha de 7 días'
        }
      ],
      rarity: 'rare',
      points: 250
    },
    {
      id: 'b-speed',
      name: 'Velocista',
      description: 'Completaste un curso en tiempo récord',
      icon: '⚡',
      color: '#8b5cf6',
      category: BadgeCategory.SPEED,
      requirements: [
        {
          type: 'time_spent',
          value: 'record',
          description: 'Completar un curso 50% más rápido que el promedio'
        }
      ],
      rarity: 'epic',
      points: 350
    },
    {
      id: 'b-perfect',
      name: 'Perfeccionista',
      description: '100% en todos los exámenes',
      icon: '💎',
      color: '#06b6d4',
      category: BadgeCategory.EXCELLENCE,
      requirements: [
        {
          type: 'quiz_score',
          value: 100,
          description: 'Obtener 100% en 5 exámenes consecutivos'
        }
      ],
      rarity: 'legendary',
      points: 1000
    }
  ];

  constructor() {
    this.loadUserBadges();
  }

  private loadUserBadges(): void {
    // Simular badges ya ganados
    const earnedBadges = [
      { ...this.allBadges[0], earnedDate: new Date('2024-01-10') }
    ];
    this.userBadgesSubject.next(earnedBadges);
  }

  getUserBadges(): Observable<Badge[]> {
    return this.userBadges$;
  }

  getAllBadges(): Observable<Badge[]> {
    return of(this.allBadges).pipe(delay(500));
  }

  awardBadge(badgeId: string, userId: string): Observable<Badge> {
    const badge = this.allBadges.find(b => b.id === badgeId);
    if (badge) {
      const awardedBadge = {
        ...badge,
        earnedDate: new Date()
      };
      
      const currentBadges = this.userBadgesSubject.value;
      currentBadges.push(awardedBadge);
      this.userBadgesSubject.next(currentBadges);
      
      return of(awardedBadge).pipe(delay(1000));
    }
    throw new Error('Badge not found');
  }

  checkBadgeProgress(userId: string): Observable<any> {
    // Lógica para verificar el progreso hacia badges no obtenidos
    return of({
      'b-streak': { current: 3, required: 7 },
      'b-perfect': { current: 2, required: 5 }
    }).pipe(delay(500));
  }
}

// notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();
  
  private notificationHistory: Notification[] = [];

  showNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    this.notificationHistory.unshift(newNotification);
    this.notificationSubject.next(newNotification);
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
    return this.notificationHistory;
  }

  markAsRead(notificationId: string): void {
    const notification = this.notificationHistory.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  clearAll(): void {
    this.notificationHistory = [];
  }
}

// =====================================
// COMPONENTES DEL MÓDULO DASHBOARD
// =====================================

// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../core/services/course.service';
import { BadgeService } from '../../core/services/badge.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user$ = this.authService.currentUser$;
  recentCourses$ = this.courseService.getCourses().pipe(
    map(courses => courses.slice(0, 4))
  );
  userBadges$ = this.badgeService.getUserBadges();
  
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
    private courseService: CourseService,
    private badgeService: BadgeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Cargar datos adicionales del dashboard
  }

  getProgressPercentage(completed: number, total: number): number {
    return (completed / total) * 100;
  }

  getStreakIcon(): string {
    if (this.stats.currentStreak >= 7) return '🔥';
    if (this.stats.currentStreak >= 3) return '⭐';
    return '✨';
  }
}

// =====================================
// COMPONENTE LISTA DE CURSOS
// =====================================

// course-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../../core/services/course.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  courses$ = this.courseService.getCourses();
  filteredCourses$: Observable<Course[]>;
  
  filters = {
    search: '',
    category: '',
    moduleType: '',
    difficulty: '',
    isInternal: null as boolean | null
  };

  categories = Object.values(CourseCategory);
  moduleTypes = Object.values(ModuleType);
  difficulties = ['beginner', 'intermediate', 'advanced'];

  sortBy: 'title' | 'date' | 'popularity' | 'difficulty' = 'date';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private courseService: CourseService,
    private router: Router
  ) {
    this.filteredCourses$ = this.courses$;
  }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCourses$ = this.courses$.pipe(
      map(courses => {
        let filtered = [...courses];

        // Aplicar filtro de búsqueda
        if (this.filters.search) {
          const searchLower = this.filters.search.toLowerCase();
          filtered = filtered.filter(course =>
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }

        // Filtrar por categoría
        if (this.filters.category) {
          filtered = filtered.filter(course => 
            course.category === this.filters.category
          );
        }

        // Filtrar por tipo de módulo
        if (this.filters.moduleType) {
          filtered = filtered.filter(course => 
            course.moduleType === this.filters.moduleType
          );
        }

        // Filtrar por dificultad
        if (this.filters.difficulty) {
          filtered = filtered.filter(course => 
            course.difficulty === this.filters.difficulty
          );
        }

        // Filtrar por interno/externo
        if (this.filters.isInternal !== null) {
          filtered = filtered.filter(course => 
            course.isInternal === this.filters.isInternal
          );
        }

        // Aplicar ordenamiento
        filtered.sort((a, b) => {
          switch (this.sortBy) {
            case 'title':
              return a.title.localeCompare(b.title);
            case 'date':
              return b.createdAt.getTime() - a.createdAt.getTime();
            case 'popularity':
              return b.enrolledStudents - a.enrolledStudents;
            case 'difficulty':
              const diffOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
              return diffOrder[a.difficulty] - diffOrder[b.difficulty];
            default:
              return 0;
          }
        });

        return filtered;
      })
    );
  }

  onSearchChange(searchTerm: string): void {
    this.filters.search = searchTerm;
    this.applyFilters();
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: '',
      moduleType: '',
      difficulty: '',
      isInternal: null
    };
    this.applyFilters();
  }

  navigateToCourse(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }

  enrollInCourse(courseId: string, event: Event): void {
    event.stopPropagation();
    // Implementar lógica de inscripción
  }

  getDifficultyColor(difficulty: string): string {
    const colors = {
      'beginner': '#10b981',
      'intermediate': '#f59e0b',
      'advanced': '#ef4444'
    };
    return colors[difficulty] || '#6b7280';
  }

  getDifficultyLabel(difficulty: string): string {
    const labels = {
      'beginner': 'Principiante',
      'intermediate': 'Intermedio',
      'advanced': 'Avanzado'
    };
    return labels[difficulty] || difficulty;
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}

// =====================================
// COMPONENTE DETALLE DEL CURSO
// =====================================

// course-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { BadgeService } from '../../../core/services/badge.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  currentChapterIndex = 0;
  isEnrolled = false;
  progress = 0;
  currentUser = this.authService.currentUserValue;
  
  activeTab: 'overview' | 'content' | 'materials' | 'discussion' = 'overview';
  
  completedChapters: Set<string> = new Set();
  quizResults: Map<string, number> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  private loadCourse(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe(course => {
      if (course) {
        this.course = course;
        this.checkEnrollmentStatus();
        this.calculateProgress();
      }
    });
  }

  checkEnrollmentStatus(): void {
    if (this.currentUser && this.course) {
      this.isEnrolled = this.currentUser.enrolledCourses.includes(this.course.id);
    }
  }

  calculateProgress(): void {
    if (this.course && this.course.chapters.length > 0) {
      const completed = this.completedChapters.size;
      const total = this.course.chapters.length;
      this.progress = Math.round((completed / total) * 100);
    }
  }

  enrollInCourse(): void {
    if (this.course && this.currentUser) {
      this.courseService.enrollInCourse(this.course.id, this.currentUser.id).subscribe(() => {
        this.isEnrolled = true;
        this.notificationService.showNotification({
          type: 'success',
          title: 'Inscripción exitosa',
          message: `Te has inscrito en ${this.course?.title}`
        });
      });
    }
  }

  startChapter(chapterIndex: number): void {
    this.currentChapterIndex = chapterIndex;
    this.activeTab = 'content';
  }

  completeChapter(chapterId: string): void {
    this.completedChapters.add(chapterId);
    this.calculateProgress();
    
    if (this.progress === 100 && this.course) {
      this.completeCourse();
    }
  }

  private completeCourse(): void {
    if (this.course && this.currentUser) {
      this.courseService.completeCourse(this.course.id, this.currentUser.id).subscribe(badge => {
        this.notificationService.showBadgeNotification(badge);
        this.badgeService.awardBadge(badge.id, this.currentUser!.id).subscribe();
      });
    }
  }

  submitQuiz(chapterId: string, answers: any): void {
    // Lógica para evaluar quiz
    const score = 85; // Simulado
    this.quizResults.set(chapterId, score);
    
    if (score >= 70) {
      this.completeChapter(chapterId);
      this.notificationService.showNotification({
        type: 'success',
        title: 'Quiz aprobado',
        message: `Has obtenido ${score}% en el quiz`
      });
    }
  }

  downloadMaterial(material: CourseMaterial): void {
    // Implementar descarga de material
    window.open(material.url, '_blank');
  }

  nextChapter(): void {
    if (this.course && this.currentChapterIndex < this.course.chapters.length - 1) {
      this.currentChapterIndex++;
    }
  }

  previousChapter(): void {
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
    }
  }
}

// =====================================
// COMPONENTE CREACIÓN/EDICIÓN DE CURSO
// =====================================

// course-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: string | null = null;
  uploadedFiles: File[] = [];
  
  categories = Object.values(CourseCategory);
  moduleTypes = Object.values(ModuleType);
  difficulties = ['beginner', 'intermediate', 'advanced'];
  
  badgeIcons = ['🏆', '🎯', '🚀', '⭐', '💎', '🔥', '⚡', '🌟'];
  badgeColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private notificationService: NotificationService
  ) {
    this.courseForm = this.createCourseForm();
  }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.isEditMode = true;
      this.loadCourseData(this.courseId);
    }
  }

  private createCourseForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      moduleType: ['', Validators.required],
      duration: [0, [Validators.required, Validators.min(1)]],
      instructor: ['', Validators.required],
      difficulty: ['beginner', Validators.required],
      isInternal: [true],
      thumbnailUrl: [''],
      videoUrl: [''],
      tags: [[]],
      prerequisites: this.fb.array([]),
      objectives: this.fb.array([]),
      chapters: this.fb.array([]),
      badge: this.fb.group({
        name: ['', Validators.required],
        description: [''],
        icon: ['🏆'],
        color: ['#3b82f6'],
        points: [100, [Validators.required, Validators.min(10)]],
        rarity: ['common']
      })
    });
  }

  get prerequisites(): FormArray {
    return this.courseForm.get('prerequisites') as FormArray;
  }

  get objectives(): FormArray {
    return this.courseForm.get('objectives') as FormArray;
  }

  get chapters(): FormArray {
    return this.courseForm.get('chapters') as FormArray;
  }

  addPrerequisite(): void {
    this.prerequisites.push(this.fb.control('', Validators.required));
  }

  removePrerequisite(index: number): void {
    this.prerequisites.removeAt(index);
  }

  addObjective(): void {
    this.objectives.push(this.fb.control('', Validators.required));
  }

  removeObjective(index: number): void {
    this.objectives.removeAt(index);
  }

  addChapter(): void {
    const chapterForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      videoUrl: [''],
      duration: [0, [Validators.required, Validators.min(1)]],
      hasQuiz: [false],
      quiz: this.fb.group({
        passingScore: [70],
        timeLimit: [30],
        questions: this.fb.array([])
      })
    });
    
    this.chapters.push(chapterForm);
  }

  removeChapter(index: number): void {
    this.chapters.removeAt(index);
  }

  addQuestion(chapterIndex: number): void {
    const questionsArray = this.getQuestionsArray(chapterIndex);
    const questionForm = this.fb.group({
      text: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctAnswer: [0, Validators.required],
      explanation: ['']
    });
    
    questionsArray.push(questionForm);
  }

  getQuestionsArray(chapterIndex: number): FormArray {
    const chapter = this.chapters.at(chapterIndex);
    return chapter.get('quiz.questions') as FormArray;
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    for (let file of files) {
      this.uploadedFiles.push(file);
    }
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  private loadCourseData(courseId: string): void {
    this.courseService.getCourseById(courseId).subscribe(course => {
      if (course) {
        this.patchCourseForm(course);
      }
    });
  }

  private patchCourseForm(course: Course): void {
    // Convertir arrays a FormArrays
    course.prerequisites.forEach(() => this.addPrerequisite());
    course.objectives.forEach(() => this.addObjective());
    course.chapters.forEach(() => this.addChapter());
    
    // Patch valores
    this.courseForm.patchValue({
      title: course.title,
      description: course.description,
      category: course.category,
      moduleType: course.moduleType,
      duration: course.duration,
      instructor: course.instructor,
      difficulty: course.difficulty,
      isInternal: course.isInternal,
      thumbnailUrl: course.thumbnailUrl,
      videoUrl: course.videoUrl,
      tags: course.tags,
      badge: {
        name: course.badge.name,
        description: course.badge.description,
        icon: course.badge.icon,
        color: course.badge.color,
        points: course.badge.points,
        rarity: course.badge.rarity
      }
    });
    
    // Patch arrays
    this.prerequisites.patchValue(course.prerequisites);
    this.objectives.patchValue(course.objectives);
  }

  async onSubmit(): Promise<void> {
    if (this.courseForm.valid) {
      const courseData = this.prepareCourseData();
      
      if (this.isEditMode && this.courseId) {
        this.courseService.updateCourse(this.courseId, courseData).subscribe(() => {
          this.notificationService.showNotification({
            type: 'success',
            title: 'Curso actualizado',
            message: 'El curso se ha actualizado correctamente'
          });
          this.router.navigate(['/courses']);
        });
      } else {
        this.courseService.createCourse(courseData).subscribe(async (newCourse) => {
          // Subir archivos si hay
          for (const file of this.uploadedFiles) {
            await this.courseService.uploadCourseMaterial(newCourse.id, file).toPromise();
          }
          
          this.notificationService.showNotification({
            type: 'success',
            title: 'Curso creado',
            message: 'El curso se ha creado exitosamente'
          });
          this.router.navigate(['/courses']);
        });
      }
    }
  }

  private prepareCourseData(): Partial<Course> {
    const formValue = this.courseForm.value;
    
    // Preparar badge
    const badge: Badge = {
      id: Date.now().toString(),
      ...formValue.badge,
      category: BadgeCategory.COMPLETION,
      requirements: [
        {
          type: 'course_completion',
          value: true,
          description: 'Completar el curso'
        }
      ]
    };
    
    // Preparar chapters
    const chapters = formValue.chapters.map((ch: any, index: number) => ({
      id: `ch-${index}`,
      title: ch.title,
      description: ch.description,
      videoUrl: ch.videoUrl,
      duration: ch.duration,
      materials: [],
      quiz: ch.hasQuiz ? {
        id: `q-${index}`,
        passingScore: ch.quiz.passingScore,
        timeLimit: ch.quiz.timeLimit,
        questions: ch.quiz.questions.map((q: any, qIndex: number) => ({
          id: `q-${index}-${qIndex}`,
          ...q
        }))
      } : undefined
    }));
    
    return {
      ...formValue,
      badge,
      chapters,
      materials: []
    };
  }

  cancel(): void {
    this.router.navigate(['/courses']);
  }
}

// =====================================
// COMPONENTE DE BADGES
// =====================================

// badges.component.ts
import { Component, OnInit } from '@angular/core';
import { BadgeService } from '../../core/services/badge.service';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss']
})
export class BadgesComponent implements OnInit {
  allBadges$ = this.badgeService.getAllBadges();
  userBadges$ = this.badgeService.getUserBadges();
  badgeProgress$ = this.badgeService.checkBadgeProgress(
    this.authService.currentUserValue?.id || ''
  );
  
  selectedCategory: BadgeCategory | 'all' = 'all';
  categories = Object.values(BadgeCategory);
  
  displayMode: 'grid' | 'list' = 'grid';
  showOnlyEarned = false;
  
  stats = {
    totalEarned: 0,
    totalPoints: 0,
    commonBadges: 0,
    rareBadges: 0,
    epicBadges: 0,
    legendaryBadges: 0
  };

  constructor(
    private badgeService: BadgeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.calculateStats();
  }

  private calculateStats(): void {
    this.userBadges$.subscribe(badges => {
      this.stats.totalEarned = badges.length;
      this.stats.totalPoints = badges.reduce((sum, b) => sum + b.points, 0);
      
      this.stats.commonBadges = badges.filter(b => b.rarity === 'common').length;
      this.stats.rareBadges = badges.filter(b => b.rarity === 'rare').length;
      this.stats.epicBadges = badges.filter(b => b.rarity === 'epic').length;
      this.stats.legendaryBadges = badges.filter(b => b.rarity === 'legendary').length;
    });
  }

  isEarned(badge: Badge): Observable<boolean> {
    return this.userBadges$.pipe(
      map(userBadges => userBadges.some(ub => ub.id === badge.id))
    );
  }

  getRarityColor(rarity: string): string {
    const colors = {
      'common': '#9ca3af',
      'rare': '#3b82f6',
      'epic': '#8b5cf6',
      'legendary': '#f59e0b'
    };
    return colors[rarity] || '#6b7280';
  }

  getRarityLabel(rarity: string): string {
    const labels = {
      'common': 'Común',
      'rare': 'Raro',
      'epic': 'Épico',
      'legendary': 'Legendario'
    };
    return labels[rarity] || rarity;
  }

  filterByCategory(category: BadgeCategory | 'all'): void {
    this.selectedCategory = category;
  }

  toggleDisplayMode(): void {
    this.displayMode = this.displayMode === 'grid' ? 'list' : 'grid';
  }

  getProgressPercentage(current: number, required: number): number {
    return Math.min((current / required) * 100, 100);
  }

  shareBadge(badge: Badge): void {
    // Implementar compartir en redes sociales
    const shareText = `¡He desbloqueado la insignia "${badge.name}" en la plataforma de capacitación! ${badge.icon}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Nueva Insignia Desbloqueada',
        text: shareText
      });
    }
  }
}

// =====================================
// MÓDULO PRINCIPAL DE LA APLICACIÓN
// =====================================

// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AuthGuard } from './core/guards/auth.guard';

// Shared Components
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BadgeDisplayComponent } from './shared/components/badge-display/badge-display.component';

// Feature Modules
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CoursesModule } from './modules/courses/courses.module';
import { BadgesModule } from './modules/badges/badges.module';
import { ProfileModule } from './modules/profile/profile.module';
import { AdminModule } from './modules/admin/admin.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    BadgeDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    DashboardModule,
    CoursesModule,
    BadgesModule,
    ProfileModule,
    AdminModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// =====================================
// ROUTING MODULE
// =====================================

// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'courses',
    loadChildren: () => import('./modules/courses/courses.module').then(m => m.CoursesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'badges',
    loadChildren: () => import('./modules/badges/badges.module').then(m => m.BadgesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }