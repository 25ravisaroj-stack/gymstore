import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Cart } from '../models/cart';
import { ProductPagedResponse } from '../models/product-paged-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  private api = 'http://localhost:3000/products';


  getProducts(): Observable<any[]> {

    return this.http.get<any[]>(this.api);

  }
  getProductsPagingwise(page: number, limit: number): Observable<ProductPagedResponse> {
    //const url = `${this.api}?_page=${page}&_limit=${limit}`;
    //  this.http.get<any[]>(`${this.api}?_page=${page}&_per_page=${limit}`).subscribe(res => 
    //   console.log(res)
    // );
    return this.http.get<ProductPagedResponse>(`${this.api}?_page=${page}&_per_page=${limit}`);

  }

  getProduct(id: any) {

    return this.http.get<any>(
      `${this.api}/${id}`
    );


  }



}