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

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/cursos/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/cursos`, course).pipe(
      tap(() => this.loadCourses())
    );
  }

  updateCourse(id: string, updates: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/cursos/${id}`, updates).pipe(
      tap(() => this.loadCourses())
    );
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cursos/${id}`).pipe(
      tap(() => this.loadCourses())
    );
  }

  enrollInCourse(courseId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${courseId}/enroll`, { userId });
  }

  completeCourse(courseId: string, userId: string): Observable<Badge> {
    return this.http.post<Badge>(`${this.apiUrl}/cursos/${courseId}/complete`, { userId });
  }

  getEnrolledCourses(userId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/users/${userId}/cursos`);
  }

  getCourseProgress(courseId: string, userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/cursos/${courseId}/progress/${userId}`);
  }

  updateCourseProgress(courseId: string, userId: string, progress: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cursos/${courseId}/progress/${userId}`, progress);
  }

  uploadCourseMaterial(courseId: string, file: File): Observable<CourseMaterial> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CourseMaterial>(`${this.apiUrl}/cursos/${courseId}/materials`, formData);
  }

  getCourseMaterials(courseId: string): Observable<CourseMaterial[]> {
    return this.http.get<CourseMaterial[]>(`${this.apiUrl}/cursos/${courseId}/materials`);
  }

  submitQuiz(courseId: string, chapterId: string, answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cursos/${courseId}/chapters/${chapterId}/quiz`, answers);
  }
}