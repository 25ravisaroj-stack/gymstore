export interface ProductPagedResponse {

      data: any[];
  first: number;
  last: number;
  next: number | null;
  prev: number | null;
  items: number;
  pages: number;
}
