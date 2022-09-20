import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaySelectorComponent } from './gateway-selector.component';

describe('GatewaySelectorComponent', () => {
  let component: GatewaySelectorComponent;
  let fixture: ComponentFixture<GatewaySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewaySelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewaySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
