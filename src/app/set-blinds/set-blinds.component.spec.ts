import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBlindsComponent } from './set-blinds.component';

describe('SetBlindsComponent', () => {
  let component: SetBlindsComponent;
  let fixture: ComponentFixture<SetBlindsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetBlindsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetBlindsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
