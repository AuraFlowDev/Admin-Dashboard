import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreshComponent } from './thresh.component';

describe('ThreshComponent', () => {
  let component: ThreshComponent;
  let fixture: ComponentFixture<ThreshComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreshComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
