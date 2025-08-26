import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Course, CourseMaterial, Badge } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}`;
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  public courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) {
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
}