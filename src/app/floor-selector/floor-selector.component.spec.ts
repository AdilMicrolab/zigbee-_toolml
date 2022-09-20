import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorSelectorComponent } from './floor-selector.component';

describe('FloorSelectorComponent', () => {
  let component: FloorSelectorComponent;
  let fixture: ComponentFixture<FloorSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
