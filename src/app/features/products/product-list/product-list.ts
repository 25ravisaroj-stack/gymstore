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
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})

export class ProductListComponent
  implements OnInit {

  @ViewChild('productContainer') productContainer!: ElementRef;
  constructor(private service: ProductService,protected toast:ToastService, private route: ActivatedRoute, private router: Router, private quantityStore: QuantityStore, private store: ProductStore, private cartstore: cartservice) { }
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




  // loadMore() {

  //   this.currentPage++;

  //   this.store.setProducts(
  //     this.allProducts.slice(
  //       0,
  //       this.currentPage * this.pageSize
  //     )
  //   );

  // }
  // @HostListener('window:scroll')
  // onScroll() {

  //   const bottom =
  //     window.innerHeight + window.scrollY >=
  //     document.body.offsetHeight - 100;

  //   if (
  //     bottom &&
  //     this.store.products().length < this.allProducts.length
  //   ) {
  //     this.loadMore();
  //   }
  // }
  // @HostListener('window:scroll')
  // onScroll() {

  //   const bottom =
  //     window.innerHeight + window.scrollY >=
  //     document.documentElement.scrollHeight - 100;

  //   if (bottom && !this.loading) {

  //     this.page++;
  //     this.loadProducts();

  //   }
  // }
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

  addToCart(product: Product): void {

    const qty = this.quantities[product.id];


    if (!product.stock || product.stock <= 0) {
      alert('Out of Stock');
      return;
    }

    if (qty > product.stock) {
      alert(`Only ${product.stock} item(s) available`);
      return;
    }

    const cartItem: cartModel = {
      productid: product.id,
      quantity: qty,
      price: product.price

    };

    this.cartstore.getCartByProductId(product.id)
      .subscribe({
        next: (items) => {

          if (items.length > 0) {

            const existingItem = items[0];

            const newQuantity =
              existingItem.quantity +
              this.quantities[product.id];

            // Stock validation
            if (newQuantity > product.stock) {

              alert(
                `Only ${product.stock} item(s) available. ` +
                `Already in cart: ${existingItem.quantity}`
              );

              return;
            }

            const updatedItem: cartModel = {
              ...existingItem,
              quantity: newQuantity
            };

            this.cartstore
              .updateCart(existingItem.id!, updatedItem)
              .subscribe(() => {
                console.log('Cart Updated');
              });

          } else {

            const cartItem: cartModel = {
              productid: product.id,
              quantity: this.quantities[product.id],
              price: product.price
            };

            this.cartstore
              .addToCart(cartItem)
              .subscribe(() => {
                this.cartstore.loadCart();
                this.toast.show('Added to Cart','S');
                
              });

          }

        }
      });

  }
  //redict to product details
  redirectToProdutDetail(productId: string): void {
    const encryptedId = btoa(productId.toString());
    this.router.navigate(['/product-details', encryptedId]);
  }


} 