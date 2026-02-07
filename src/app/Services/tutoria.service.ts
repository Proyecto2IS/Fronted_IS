import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TutoriaInterface } from '../Interfaces/tutoria.interface';

@Injectable({
  providedIn: 'root'
})
export class TutoriasService {

  apiUrl = 'http://localhost:3000/tutorias';

  constructor(private http: HttpClient) {}

  getTutoriasDocente(): Observable<TutoriaInterface[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<TutoriaInterface[]>(`${this.apiUrl}/docente`, { headers });
  }


// 🔹 ESTUDIANTE
  crearTutoria(data: TutoriaInterface): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

 obtenerTutoriasEstudiante(): Observable<TutoriaInterface[]> {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<TutoriaInterface[]>(`${this.apiUrl}/estudiante`, { headers });
}
  aceptarPropuesta(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/propuestas/alternativas/${id}/aceptar`, {});
  }

  editarTutoria(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/estado`, { estado });
  }

  cancelarConPropuesta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, data);
  }

  // 🔹 HISTORIAL
  obtenerHistorial(): Observable<TutoriaInterface[]> {
    return this.http.get<TutoriaInterface[]>(`${this.apiUrl}/historial/finalizadas`);
  }
}

