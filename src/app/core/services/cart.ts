import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { Cart as cartModel } from '../models/cart';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { ProductService } from './product';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  constructor(private http: HttpClient, private productService: ProductService) { }

  private services = 'http://localhost:3000/cart';
  cartItems = signal<any[]>([]);

  loadCart() {
    this.getcartItem().subscribe(res => {
      this.cartItems.set(res);
    });
  }

  totalItems = computed(() => this.cartItems().length);

  getCartByProductId(productId: number) {
    return this.http.get<cartModel[]>(
      `${this.services}?productid=${productId}`
    );
  }
  updateCart(id: number | string, item: cartModel) {
    return this.http.put(
      `${this.services}/${id}`,
      item
    );
  }
  updatefromCart(id: number | string, quantity: number) {
    return this.http.patch(
      `${this.services}/${id}`, {
      quantity: quantity
    }
    );
  }

  addToCart(item: cartModel) {
    return this.http.post(this.services,
      item
    );
  }
  deleteCart(id: number) {
    return this.http.delete(
      `${this.services}/${id}`
    );
  }
  getcartItem() {
    return this.http.get<cartModel[]>(`${this.services}`)
  }


  getCartWithProducts() {
    return this.getcartItem().pipe(
      switchMap(cartItems => {

        const requests = cartItems.map(item =>
          this.productService.getProduct(item.productid).pipe(
            map(product => ({
              ...item,
              name: product.name,
              image: product.image,
              stock: product.stock,

            }))
          )
        );

        return forkJoin(requests);
      })
    );
  }
  deleteMultiple(ids: (string |number)[]): Observable<any>  {
return forkJoin(
    ids.map(id =>
      this.http.delete(`${this.services}/${id}`)
    )
  );


  // return this.http.request(
  //   'delete',
  //   `${this.services}/delete-multiple`,
  //   {
  //     body: { ids }
  //   }
  // );
}

}
