import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreshmodalComponent } from './treshmodal.component';

describe('TreshmodalComponent', () => {
  let component: TreshmodalComponent;
  let fixture: ComponentFixture<TreshmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreshmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreshmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
