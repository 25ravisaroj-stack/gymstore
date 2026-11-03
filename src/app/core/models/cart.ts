export interface Cart {

    id?: number| string;
    productid: number;
    quantity: number;
    price: number;
    image?:string;
    name?:string;
    stock?:number;
    
}
