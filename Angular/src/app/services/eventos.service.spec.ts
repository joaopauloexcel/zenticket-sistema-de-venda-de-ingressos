import { TestBed } from '@angular/core/testing';

import { EventosService } from './eventos.service';

describe('EventosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventosService = TestBed.get(EventosService);
    expect(service).toBeTruthy();
  });
});
