import { TestBed, inject } from '@angular/core/testing';

import { LayoutService } from './layout-service.service';

describe('LayoutServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayoutService]
    });
  });

  it('should be created', inject([LayoutService], (service: LayoutService) => {
    expect(service).toBeTruthy();
  }));
});
