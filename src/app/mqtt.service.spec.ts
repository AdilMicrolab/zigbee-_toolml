import { TestBed } from '@angular/core/testing';

import { Mqtt } from './mqtt.service';

describe('MqttService', () => {
  let service: Mqtt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mqtt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
