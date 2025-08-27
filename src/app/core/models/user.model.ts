export interface User {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol: UserRole;
  fecha_registro: Date;
}

export enum UserRole {
  PROFESOR = 'profesor',
  ESTUDIANTE = 'estudiante'
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  type: string;
}

export interface RegisterRequest {
  nombre: string;
  correo: string;
  password: string;
  rol?: UserRole;
}