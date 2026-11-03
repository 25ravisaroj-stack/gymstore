import {
  Injectable,
  signal,
  computed
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductStore {

  products = signal<any[]>([]);

  count = computed(
    () => this.products().length
  );

  setProducts(data: any[]) {

    this.products.set(data);

  }

  addProduct(product: any) {

    this.products.update(
      items => [
        ...items,
        product
      ]
    );

  }

  removeProduct(id: number) {

    this.products.update(
      items =>
        items.filter(
          x => x.id !== id
        )
    );

  }

}