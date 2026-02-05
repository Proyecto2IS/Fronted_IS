import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarTutoriaPage } from './solicitar-tutoria.page';

describe('SolicitarTutoriaPage', () => {
  let component: SolicitarTutoriaPage;
  let fixture: ComponentFixture<SolicitarTutoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarTutoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
