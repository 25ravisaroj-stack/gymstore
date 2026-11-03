import { Injectable, Service, signal } from '@angular/core';
import { Cart as cartService } from '../../core/services/cart';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class QuantityStore {
    quantities = signal<Record<number | string, number>>({});
    constructor(private cartserive: cartService) { }
    getQuantity(id: any): any {


        return this.quantities()[id] || 1;;

    }

    increase(itemid: any, stock: number, quntity: number) {

        if (quntity >= stock) {
            return EMPTY;
        }

        const updateDatedValue = quntity + 1;

        return this.cartserive.updatefromCart(
            itemid,
            updateDatedValue
        ).pipe(
            tap(() => {
                this.quantities.update(q => ({
                    ...q,
                    [itemid]: updateDatedValue
                }));
            })
        );
    }

    decrease(itemid: any, quntity: number) {

        if (quntity <= 1) {
            return EMPTY;
        }

        const updateDatedValue = quntity - 1;

        return this.cartserive.updatefromCart(
            itemid,
            updateDatedValue
        ).pipe(
            tap(() => {
                this.quantities.update(q => ({
                    ...q,
                    [itemid]: updateDatedValue
                }));
            })
        );
    }

    setQuantity(cartId: string | number, qty: number): void {
        this.quantities.update(q => ({
            ...q,
            [cartId]: qty
        }));
        console.log('All Quantities:', this.quantities());
        console.log('Current Id:', cartId);
    }

}
