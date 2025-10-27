export interface ProductColor {
  name: string;
  image: string;
}

export interface Product {
  id: number;
  name:string;
  price: number;
  images: string[];
  description?: string;
  amazonLink?: string;
  sizes?: string[];
  colors?: ProductColor[];
}
