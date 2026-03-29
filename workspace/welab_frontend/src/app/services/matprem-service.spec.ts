import { TestBed } from '@angular/core/testing';

import { MatpremService } from './matprem-service';

describe('MatpremService', () => {
  let service: MatpremService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatpremService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
