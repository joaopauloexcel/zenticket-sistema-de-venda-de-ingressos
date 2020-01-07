import { TestBed } from '@angular/core/testing';

import { InscricoesService } from './inscricoes.service';

describe('InscricoesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InscricoesService = TestBed.get(InscricoesService);
    expect(service).toBeTruthy();
  });
});
