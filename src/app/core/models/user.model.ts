import { Badge } from './badge.model';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  profilePicture?: string;
  joinDate: Date;
  lastActive: Date;
  
  // Campos adicionales para gamificación
  badges?: Badge[];
  enrolledCourses?: string[];
  completedCourses?: string[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR', 
  STUDENT = 'STUDENT'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}