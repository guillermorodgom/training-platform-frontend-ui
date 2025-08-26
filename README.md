# Training Platform Frontend UI

Frontend Angular para la plataforma de capacitación empresarial.

## 🚀 Características

- **Dashboard interactivo** con estadísticas de progreso
- **Sistema de gamificación** con insignias y rankings
- **Gestión de cursos** con filtros avanzados
- **Autenticación JWT** con roles (Admin, Instructor, Estudiante)
- **Responsive design** adaptable a dispositivos móviles
- **Lazy loading** para óptimo rendimiento
- **Arquitectura modular** escalable

## 🛠️ Tecnologías

- **Angular 12.2.0**
- **TypeScript 4.3.5**
- **RxJS 6.6.0**
- **Angular Router** con guards y lazy loading
- **SCSS** para estilos modulares

## 📋 Prerequisitos

- **Node.js 16-18** (recomendado para compatibilidad con Angular 12)
- **npm** o **yarn**

## 🔧 Instalación y Configuración

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el endpoint del backend**
   - Edita `src/environments/environment.ts`
   - Cambia `apiUrl` por la URL de tu backend:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api'  // Cambia por tu URL
   };
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

5. **Compilar para producción**
   ```bash
   npm run build:prod
   ```

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/                    # Servicios, guards, interceptors, modelos
│   ├── models/             # Interfaces de datos (User, Course, Badge)
│   ├── services/           # Servicios para API (Auth, Course, Badge)
│   ├── guards/             # Guards de autenticación
│   └── interceptors/       # Interceptors HTTP
├── shared/                 # Componentes reutilizables
│   ├── components/         # Header, Sidebar, BadgeDisplay
│   └── shared.module.ts    # Módulo compartido
├── modules/                # Módulos de funcionalidad
│   ├── auth/              # Autenticación y login
│   ├── dashboard/         # Dashboard principal
│   ├── courses/           # Gestión de cursos
│   ├── badges/            # Sistema de insignias
│   ├── profile/           # Perfil de usuario
│   └── admin/             # Panel administrativo
└── environments/          # Configuraciones de entorno
```

## 🔌 Conexión con Backend

El frontend está configurado para conectarse con un backend Spring Boot:

### Endpoints esperados:
- `POST /api/auth/login` - Autenticación
- `GET /api/auth/profile` - Perfil actual
- `GET /api/cursos` - Lista de cursos
- `GET /api/cursos/{id}` - Detalle de curso
- `POST /api/cursos/{id}/enroll` - Inscribirse a curso
- `GET /api/user/badges` - Insignias del usuario
- `GET /api/users/{id}/cursos` - Cursos del usuario

### Headers automáticos:
- `Authorization: Bearer {token}` (automático después del login)
- `Content-Type: application/json`

## 🎮 Funcionalidades Implementadas

### ✅ Core Features
- [x] Arquitectura modular con lazy loading
- [x] Sistema de autenticación con JWT
- [x] Guards para protección de rutas
- [x] Interceptors para manejo automático de tokens
- [x] Servicios para comunicación con API

### ✅ UI Components
- [x] Header responsive con notificaciones
- [x] Sidebar navegacional con estadísticas
- [x] Dashboard con métricas y progreso
- [x] Componente reutilizable para badges
- [x] Layout principal adaptativo

### 🔄 En desarrollo
- [ ] Formulario de login funcional
- [ ] Lista completa de cursos con filtros
- [ ] Detalle de curso con capítulos
- [ ] Galería de insignias
- [ ] Panel administrativo
- [ ] Perfil de usuario editable

## 🚦 Scripts Disponibles

```bash
npm start          # Desarrollo en localhost:4200
npm run build      # Build de desarrollo
npm run build:prod # Build de producción optimizado
npm run watch      # Build continuo en modo desarrollo
npm test           # Ejecutar tests unitarios
```

## 🐛 Solución de Problemas

### Error de OpenSSL (Node.js 17+)
Si obtienes errores relacionados con `digital envelope routines::unsupported`:
- Los scripts ya incluyen `NODE_OPTIONS="--openssl-legacy-provider"`
- Alternativamente, usa Node.js 16 LTS

### Errores de compilación
- Verifica que todas las dependencias estén instaladas: `npm install`
- Limpia cache: `npm start -- --delete-output-path`

### Problemas de conexión con el backend
- Verifica que `environment.ts` tenga la URL correcta
- Confirma que el backend esté ejecutándose y acepte CORS
- Revisa la consola del navegador para errores de red

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Experiencia completa con sidebar
- **Tablet**: Layout adaptado con navegación colapsable
- **Mobile**: Interfaz móvil con menú hamburguesa

## 🔒 Roles y Permisos

- **Admin**: Acceso completo, gestión de usuarios y cursos
- **Instructor**: Creación y gestión de cursos asignados
- **Student**: Visualización de cursos, inscripción y progreso

## 📈 Performance

- **Lazy loading** de módulos para carga inicial rápida
- **OnPush Change Detection** para optimización
- **Preloading Strategy** configurada para módulos frecuentes
- **Bundle size** optimizado con tree-shaking

## 🤝 Desarrollo

Para contribuir al proyecto:

1. Sigue la estructura modular existente
2. Usa los servicios core para comunicación con API
3. Implementa componentes reutilizables en shared/
4. Mantén consistencia en estilos SCSS
5. Documenta nuevas funcionalidades

---

**Nota**: Este proyecto utiliza Angular 12 con Node.js legacy support para máxima compatibilidad. Para proyectos nuevos se recomienda actualizar a versiones más recientes de Angular.