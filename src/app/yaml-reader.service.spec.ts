import { TestBed } from '@angular/core/testing';

import { YamlReaderService } from './yaml-reader.service';

describe('YamlReaderService', () => {
  let service: YamlReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YamlReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
