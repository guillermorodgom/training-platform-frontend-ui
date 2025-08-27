import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Course, CourseMaterial, Badge, UserChapter, UserChaptersResponse } from '../models';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;
  private userCoursesApiUrl = 'http://localhost:8081/api'; // URL específica para cursos de usuario
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.getCourses().subscribe(courses => {
      this.coursesSubject.next(courses);
    });
  }

  getCourses(filters?: any): Observable<Course[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params = params.set(key, filters[key]);
        }
      });
    }
    return this.http.get<Course[]>(`${this.apiUrl}/cursos`, { params });
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/cursos/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/cursos`, course).pipe(
      tap(() => this.loadCourses())
    );
  }

  updateCourse(id: number, updates: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/cursos/${id}`, updates).pipe(
      tap(() => this.loadCourses())
    );
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cursos/${id}`).pipe(
      tap(() => this.loadCourses())
    );
  }

  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${courseId}/enrollar`, {});
  }

  completeCourse(courseId: number): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/cursos/${courseId}/completar`, {});
  }

  getEnrolledCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/progreso/mis-cursos`);
  }

  getCourseProgress(courseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/progreso/curso/${courseId}`);
  }

  updateCourseProgress(courseId: number, progress: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/progreso/curso/${courseId}`, progress);
  }

  uploadCourseMaterial(courseId: number, file: File): Observable<CourseMaterial> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CourseMaterial>(`${this.apiUrl}/contenidos`, formData);
  }

  getCourseMaterials(courseId: number): Observable<CourseMaterial[]> {
    return this.http.get<CourseMaterial[]>(`${this.apiUrl}/contenidos/curso/${courseId}`);
  }

  submitQuiz(courseId: number, chapterId: number, answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${courseId}/capitulos/${chapterId}/quiz`, answers);
  }
  
  getCoursesByCategory(categoria: string): Observable<Course[]> {
    const params = new HttpParams().set('categoria', categoria);
    return this.http.get<Course[]>(`${this.apiUrl}/cursos/categoria`, { params });
  }

  getCoursesByLevel(nivel: string): Observable<Course[]> {
    const params = new HttpParams().set('nivel', nivel);
    return this.http.get<Course[]>(`${this.apiUrl}/cursos/nivel`, { params });
  }

  /**
   * Obtiene los capítulos con cursos del usuario actual
   * @param userId - ID del usuario
   * @returns Observable con los capítulos y cursos del usuario
   */
  getUserChaptersWithCourses(userId: number): Observable<UserChapter[]> {
    console.log('CourseService: Getting user chapters for userId:', userId);
    
    // Obtener el token de autenticación
    const token = this.authService.getToken();
    
    if (!token) {
      console.error('CourseService: No authentication token found');
      throw new Error('No hay token de autenticación');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const url = `${this.userCoursesApiUrl}/usuario-cursos/usuario/${userId}/capitulos`;
    console.log('CourseService: Making request to:', url);

    return this.http.get<UserChaptersResponse>(url, { headers })
      .pipe(
        map(response => {
          console.log('CourseService: Raw response:', response);
          
          // La respuesta ya viene en el formato correcto según el ejemplo
          const chapters = Array.isArray(response) ? response : [];
          
          console.log('CourseService: Processed chapters:', chapters);
          return chapters;
        }),
        catchError(error => {
          console.error('CourseService: Error getting user chapters:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene los cursos del usuario actual (método de conveniencia)
   * Nota: Necesitamos el ID del usuario del localStorage o del token JWT
   */
  getCurrentUserChaptersWithCourses(): Observable<UserChapter[]> {
    const currentUser = this.authService.currentUserValue;
    
    if (!currentUser || !currentUser.id_usuario) {
      console.error('CourseService: No current user found');
      throw new Error('Usuario no autenticado');
    }

    return this.getUserChaptersWithCourses(currentUser.id_usuario);
  }
}