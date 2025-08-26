import { Badge } from './badge.model';

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}