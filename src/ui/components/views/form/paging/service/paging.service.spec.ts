import { TestBed, inject } from '@angular/core/testing';

import { Paging.ServiceService } from './paging.service.service';

describe('Paging.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Paging.ServiceService]
    });
  });

  it('should be created', inject([Paging.ServiceService], (service: Paging.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
