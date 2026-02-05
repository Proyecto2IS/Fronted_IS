import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfesorHistorialPage } from './profesor-historial.page';

describe('ProfesorHistorialPage', () => {
  let component: ProfesorHistorialPage;
  let fixture: ComponentFixture<ProfesorHistorialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfesorHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
