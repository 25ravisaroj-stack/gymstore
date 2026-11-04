import {
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { ProductService }
  from '../../../core/services/product';

import { ProductStore }
  from '../../../store/product';
import { Cart as cartModel } from '../../../core/models/cart';
import { Product } from '../../../core/models/product';

import { Cart as cartservice } from '../../../core/services/cart';
import { QuantityStore } from '../../../core/services/quantity-store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-product-lists',
  standalone: true,
  templateUrl: './product-lists.html',
  styleUrl: './product-lists.scss'
})

export class ProductListsComponent
  implements OnInit {

  @ViewChild('productContainer') productContainer!: ElementRef;
  constructor(private service: ProductService, protected toast: ToastService, private route: ActivatedRoute, private router: Router, private quantityStore: QuantityStore, private store: ProductStore, private cartstore: cartservice) { }
  quantities: Record<number, number> = {};
  visibleProducts: any[] = [];
  allProducts: any[] = [];

  page = 1;
  limit = 8;
  loading = false;
  hasMoreData = true;
  showSuccess = signal(false);
  ngOnInit() {
    this.loadProducts();

  }
  loadProducts() {

    if (this.loading || !this.hasMoreData) {
      return;
    }

    this.loading = true;

    this.service.getProductsPagingwise(this.page, this.limit)
      .subscribe({
        next: (res) => {

          if (res.data.length < this.limit) {
            this.hasMoreData = false;
          }

          this.store.setProducts([
            ...this.store.products(),
            ...res.data
          ]);



          res.data.forEach(product => {
            this.quantities[product.id] =
              this.quantities[product.id] || 1;
          });

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }


  @HostListener('window:scroll')
  onScroll() {

    if (!this.productContainer) return;

    const rect =
      this.productContainer.nativeElement.getBoundingClientRect();

    const reachedProductsEnd =
      rect.bottom <= window.innerHeight + 100;

    if (
      reachedProductsEnd &&
      !this.loading &&
      this.hasMoreData
    ) {
      this.page++;
      this.loadProducts();
    }
  }
  decrease(product: Product): void {
    if (this.quantities[product.id] > 1) {

      this.quantities[product.id]--;

    }

  }

  Increase(product: Product): void {

    const currentQty = this.quantities[product.id];

    if (currentQty < product.stock) {

      this.quantities[product.id]++;

    } else {

      alert(`Maximum stock available is ${product.stock}`);

    }
  }

  addToCart(product: any, qty: number = 1) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existing = cart.find((x: any) => x.productid === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        productid:  btoa(product.id.toString()),
        quantity: qty,
        price: product.price,
        image: product.image,
        name: product.name
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartstore.getCartCount();
    this.toast.show('Added to Cart','S');
  }




} 