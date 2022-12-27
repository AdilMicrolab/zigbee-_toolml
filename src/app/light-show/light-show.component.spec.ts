import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightShowComponent } from './light-show.component';

describe('LightShowComponent', () => {
  let component: LightShowComponent;
  let fixture: ComponentFixture<LightShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LightShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
