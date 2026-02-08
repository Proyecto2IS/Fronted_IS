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
 actualizarEstadoTutoria(id: number, estado: string) {
  const token = localStorage.getItem('token');

  return this.http.put(
    `http://localhost:3000/tutorias/${id}/estado`,
    {
      estado: estado   // 👈 AQUÍ está la clave
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
}
cancelarTutoria(id:number, motivo:string, propuestas:any[]){

  const token = localStorage.getItem('token');

  return this.http.put(
    `http://localhost:3000/tutorias/${id}/cancelar`,
    {
      motivo: motivo,
      propuestas: propuestas
    },
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
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
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(`${this.apiUrl}/propuestas/alternativas/${id}/aceptar`, {}, { headers });
}

  editarTutoria(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  cambiarEstado(id: number, estado: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(
      `${this.apiUrl}/${id}/estado`,
      { estado },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  cancelarConPropuesta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, data);
  }

  // 🔹 HISTORIAL
  obtenerHistorial(): Observable<TutoriaInterface[]> {

  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<TutoriaInterface[]>(
    `${this.apiUrl}/historial/finalizadas`,
    { headers }
  );
}
obtenerTutoriasDocente(){
  const token = localStorage.getItem('token');

  return this.http.get(
    'http://localhost:3000/tutorias/docente',
    {
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );
}


}

