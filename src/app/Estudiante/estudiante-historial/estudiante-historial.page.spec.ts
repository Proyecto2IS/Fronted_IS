import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstudianteHistorialPage } from './estudiante-historial.page';

describe('EstudianteHistorialPage', () => {
  let component: EstudianteHistorialPage;
  let fixture: ComponentFixture<EstudianteHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
