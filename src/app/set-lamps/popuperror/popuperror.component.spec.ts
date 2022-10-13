import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopuperrorComponent } from './popuperror.component';

describe('PopuperrorComponent', () => {
  let component: PopuperrorComponent;
  let fixture: ComponentFixture<PopuperrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopuperrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopuperrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
