import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./Login/login/login.page').then( m => m.LoginPage)
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'estudiante',
    loadComponent: () => import('./Estudiante/estudiante/estudiante.page').then( m => m.EstudiantePage)
  },

  {
    path: 'profesor',
    loadComponent: () => import('./Profesor/profesor/profesor.page').then( m => m.ProfesorPage)
  },

  {
    path: 'solicitar-tutoria',
    loadComponent: () => import('./Estudiante/solicitar-tutoria/solicitar-tutoria.page').then( m => m.SolicitarTutoriaPage)
  },

  {
    path: 'estudiante-solicitudes',
    loadComponent: () => import('./Estudiante/estudiante-solicitudes/estudiante-solicitudes.page').then( m => m.EstudianteSolicitudesPage)
  },

  {
    path: 'estudiante-historial',
    loadComponent: () => import('./Estudiante/estudiante-historial/estudiante-historial.page').then( m => m.EstudianteHistorialPage)
  },

  {
    path: 'profesor-disponibilidad',
    loadComponent: () => import('./Profesor/profesor-disponibilidad/profesor-disponibilidad.page').then( m => m.ProfesorDisponibilidadPage)
  },

  {
    path: 'profesor-solicitudes',
    loadComponent: () => import('./Profesor/profesor-solicitudes/profesor-solicitudes.page').then( m => m.ProfesorSolicitudesPage)
  },

  {
    path: 'profesor-historial',
    loadComponent: () => import('./Profesor/profesor-historial/profesor-historial.page').then( m => m.ProfesorHistorialPage)
  },

];
