import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorDisponibilidadPage } from './profesor-disponibilidad.page';

describe('ProfesorDisponibilidadPage', () => {
  let component: ProfesorDisponibilidadPage;
  let fixture: ComponentFixture<ProfesorDisponibilidadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorDisponibilidadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
