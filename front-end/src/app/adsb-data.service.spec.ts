import { TestBed } from '@angular/core/testing';

import { AdsbDataService } from './adsb-data.service';

describe('AdsbDataService', () => {
  let service: AdsbDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsbDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
