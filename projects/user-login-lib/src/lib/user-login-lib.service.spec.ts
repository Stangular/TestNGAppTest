import { TestBed, inject } from '@angular/core/testing';

import { UserLoginLibService } from './user-login-lib.service';

describe('UserLoginLibService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserLoginLibService]
    });
  });

  it('should be created', inject([UserLoginLibService], (service: UserLoginLibService) => {
    expect(service).toBeTruthy();
  }));
});
