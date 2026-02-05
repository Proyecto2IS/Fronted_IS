import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstudianteSolicitudesPage } from './estudiante-solicitudes.page';

describe('EstudianteSolicitudesPage', () => {
  let component: EstudianteSolicitudesPage;
  let fixture: ComponentFixture<EstudianteSolicitudesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudianteSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
