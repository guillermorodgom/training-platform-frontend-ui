import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CourseService } from '../../../core/services/course.service';
import { UserChapter } from '../../../core/models';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit, OnDestroy {
  userChapters: UserChapter[] = [];
  isLoading = true;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadUserCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserCourses(): void {
    console.log('MyCoursesComponent: Loading user courses');
    this.isLoading = true;
    this.errorMessage = '';

    this.courseService.getCurrentUserChaptersWithCourses()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (chapters) => {
          console.log('MyCoursesComponent: Received chapters:', chapters);
          this.userChapters = chapters;
          
          if (chapters.length === 0) {
            this.errorMessage = 'No tienes cursos asignados actualmente.';
          }
        },
        error: (error) => {
          console.error('MyCoursesComponent: Error loading courses:', error);
          this.errorMessage = error.message || 'Error al cargar tus cursos. Intenta nuevamente.';
        }
      });
  }

  onRefresh(): void {
    this.loadUserCourses();
  }

  onViewChapter(chapter: UserChapter): void {
    console.log('MyCoursesComponent: Viewing chapter:', chapter);
    // Aquí puedes agregar lógica para ver el contenido del capítulo
  }

  onViewCourse(courseId: number): void {
    console.log('MyCoursesComponent: Viewing course:', courseId);
    // Aquí puedes agregar lógica para navegar al detalle del curso
  }

  getChapterDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  }

  getProgressColor(nivel: string): string {
    switch (nivel.toLowerCase()) {
      case 'básico':
        return '#4CAF50'; // Verde
      case 'intermedio':
        return '#FF9800'; // Naranja
      case 'avanzado':
        return '#F44336'; // Rojo
      default:
        return '#757575'; // Gris
    }
  }

  getProgressPercentage(): number {
    // Por ahora retornamos un valor fijo, puedes implementar lógica real más adelante
    return Math.floor(Math.random() * 100);
  }

  trackByChapter(index: number, chapter: UserChapter): number {
    return chapter.idCapitulo;
  }

  trackByCourse(index: number, course: any): number {
    return course.idCurso;
  }
}