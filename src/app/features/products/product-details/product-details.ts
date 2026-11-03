import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ProductService
}
  from '../../../core/services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetailsComponent {
  product: any = null;


  constructor(private route: ActivatedRoute, private productservice: ProductService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const encryptedId = params.get('id');
      const id = atob(encryptedId!);
      this.productservice.getProduct(id).subscribe({
        next: (res) => {
          this.product = res;
          console.log(this.product);
          this.cdr.detectChanges();
        }
      });

    });

  }

}
