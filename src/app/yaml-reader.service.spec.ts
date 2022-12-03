import { TestBed } from '@angular/core/testing';

import { GetYamlService } from './yaml-reader.service';

describe('YamlReaderService', () => {
  let service: GetYamlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetYamlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
