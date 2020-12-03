import { TestBed, inject } from '@angular/core/testing';

import { FamilyLineageService } from './family-lineage.service';

describe('FamilyLineageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FamilyLineageService]
    });
  });

  it('should be created', inject([FamilyLineageService], (service: FamilyLineageService) => {
    expect(service).toBeTruthy();
  }));
});
