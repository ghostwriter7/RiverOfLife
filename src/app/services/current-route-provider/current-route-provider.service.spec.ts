import { TestBed } from '@angular/core/testing';

import { CurrentRouteProvider } from './current-route-provider.service';

describe('CurrentRouteProviderService', () => {
  let service: CurrentRouteProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentRouteProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
