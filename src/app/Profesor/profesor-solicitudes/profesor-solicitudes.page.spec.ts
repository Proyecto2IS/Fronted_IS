import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorSolicitudesPage } from './profesor-solicitudes.page';

describe('ProfesorSolicitudesPage', () => {
  let component: ProfesorSolicitudesPage;
  let fixture: ComponentFixture<ProfesorSolicitudesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorSolicitudesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
