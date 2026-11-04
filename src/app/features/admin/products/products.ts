import { Component, Injectable, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product'

@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.scss',
  templateUrl: './products.html',
})
@Injectable({
  providedIn: "root"
})
export class Products {

 
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
