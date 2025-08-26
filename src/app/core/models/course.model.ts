import { Badge } from './badge.model';

export interface Course {
  idCurso: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  estado: string;
  fechaCreacion: Date;
  capitulos: Chapter[];
  
  // Campos adicionales para el frontend (gamificación)
  duration?: number;
  instructor?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  materials?: CourseMaterial[];
  prerequisites?: string[];
  objectives?: string[];
  isInternal?: boolean;
  enrolledStudents?: number;
  completionRate?: number;
  badge?: Badge;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface Chapter {
  idCapitulo: number;
  titulo: string;
  contenidoUrl: string;
  orden: number;
  fechaCreacion: Date;
  
  // Campos adicionales para el frontend (gamificación)
  description?: string;
  videoUrl?: string;
  duration?: number;
  materials?: CourseMaterial[];
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