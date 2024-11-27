import { Distribution } from "./destribution";
import { Pharmacy } from "./pharmacy";
import { Product } from "./product";

export interface Order {
  id: string;
  pharmacy: Pharmacy;
  distribution: Distribution;
  orderProducts: OrderProductCount[];
  createdAt: Date;
}

export interface OrderProductCount {
  product: Product;
  count: number;
}
