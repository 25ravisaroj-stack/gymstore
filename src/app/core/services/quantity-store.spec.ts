import { TestBed } from '@angular/core/testing';
import { QuantityStore } from './quantity-store';

describe('QuantityStore', () => {
  let service: QuantityStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuantityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
