import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TutoriaInterface } from '../Interfaces/tutoria.interface';

@Injectable({
  providedIn: 'root'
})
export class TutoriasService {
    private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  apiUrl = 'http://localhost:3000/tutorias';

  constructor(private http: HttpClient) {}

  getTutoriasDocente(): Observable<TutoriaInterface[]> {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<TutoriaInterface[]>(`${this.apiUrl}/docente`, { headers });
  }
  getMaterias() {
  return this.http.get<any[]>('http://localhost:3000/tutorias/materias');
}

getEstudiantes() {
  return this.http.get<any[]>('http://localhost:3000/usuarios/estudiantes');
}

getDocentes() {
  return this.http.get<any[]>('http://localhost:3000/usuarios/docentes');
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
   crearTutoria(data: TutoriaInterface): Observable<TutoriaInterface> {
    return this.http.post<TutoriaInterface>(
      `${this.apiUrl}/`,
      data,
      { headers: this.getHeaders() }
    );
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
      `${this.apiUrl}/estudiante`,
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
getDocentesPorMateria(materiaId: number) {
  return this.http.get<any[]>(
    `http://localhost:3000/usuarios/docentes/materia/${materiaId}`
  );
}
getDisponibilidadDocente(docenteId: number) {
  return this.http.get<any[]>(
    `http://localhost:3000/disponibilidad/docente/${docenteId}`
  );
}

}

