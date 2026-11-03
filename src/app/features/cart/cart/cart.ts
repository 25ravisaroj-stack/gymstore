import { Component, inject, signal, computed } from '@angular/core';

import { Cart as cartModel } from '../../../core/models/cart';
import { Cart as cartService } from '../../../core/services/cart';
import { QuantityStore } from '../../../core/services/quantity-store';
import { ProductService } from '../../../core/services/product';
import { ToastService } from '../../../core/services/toast-service';

@Component({
    selector: 'app-cart',
    standalone: true,
    templateUrl: './cart.html'
})
export class CartComponent {

    constructor(private store: cartService,private toast:ToastService, private quantityStore: QuantityStore, private productService: ProductService) { }
    showSuccess = signal(false);
    showfailed = signal(false);
    cart = signal<cartModel[]>([]);
    ngOnInit(): void {
        this.loadCart();
    }

    loadCart() {
        this.store.getCartWithProducts().subscribe({
            next: (res) => {
                console.log('Cart Response', res);

                this.cart.set(res as cartModel[]);
                (res as cartModel[]).forEach(item => {

                    this.quantityStore.setQuantity(
                        item.id!,
                        item.quantity
                    );
                });
            },
            error: err => {
                console.log(err);
            }
        })
    }
    totalAmount = computed(() =>
        this.cart().reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        )
    );

    totalItems = computed(() =>
        this.cart().reduce(
            (total, item) => total + item.quantity,
            0
        )
    );
    refresh() {
        this.store.getCartWithProducts().subscribe({
            next: (res) => {

                this.cart.set([]);
                this.cart.set(res as cartModel[]);

            },
            error: err => {
                console.log(err);
            }
        })
    }

    increase(item: any): void {
        this.productService.getProduct(item.productid)
            .subscribe({
                next: (product) => {

                    const stock = product.stock;

                    if (item.quantity < stock) {

                        this.quantityStore.increase(
                            item.id,
                            stock,
                            item.quantity
                        )?.subscribe({
                            next: () => {
                                this.refresh();
                            }
                        });

                        // this.getQuantity(item.id);

                    } else {
                        //alert('Maximum stock reached');
                    }

                },
                error: (err) => {
                    console.log(err);
                }
            });

    }

    decrease(item: any): void {
        this.quantityStore.decrease(
            item.id, item.quantity
        )?.subscribe({
            next: () => {
                this.refresh();
            }
        });

    }
    deleteCart(id: any) {
        this.store.deleteCart(id).subscribe({
            next: () => {
                this.store.loadCart();
                this.toast.show('item removed','S');
                this.refresh();
            },
            error: (err) => {
                this.toast.show('item removed'+err,'E');
                console.log(err);
            }
        });
    }
    proceed() {
        this.store.getCartWithProducts().subscribe({
            next: (res) => {

                const selectedIds: (number | string)[] = [];
                (res as cartModel[]).forEach(element => {
                    if (
                        element.stock &&
                        element.stock > 0 &&
                        element.quantity <= Number(element.stock)
                    ) {
                        selectedIds.push(element.id!);
                    }

                });
                if (selectedIds.length === 0) {
                    return;
                }
                this.store.deleteMultiple(selectedIds).subscribe({
                    next: () => {
                        console.log('Deleted');
                        this.toast.show('item proceeded','S');

                    },
                    error: (err) => {
                         console.log('Deleted error '+err);
                         this.toast.show('err-'+ err,'E');
                       
                    }
                });

            }
        })
    }
}

