import { ComponentFixture, TestBed } from '@angular/core/testing';
import { cartnew } from './cartnew';

describe('Cart', () => {
  let component: cartnew;
  let fixture: ComponentFixture<cartnew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [cartnew],
    }).compileComponents();

    fixture = TestBed.createComponent(cartnew);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
