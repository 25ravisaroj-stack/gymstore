import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductLists } from './product-lists';

describe('ProductList', () => {
  let component: ProductLists;
  let fixture: ComponentFixture<ProductLists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLists],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductLists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
