import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLampsComponent } from './set-lamps.component';

describe('SetLampsComponent', () => {
  let component: SetLampsComponent;
  let fixture: ComponentFixture<SetLampsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetLampsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetLampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
