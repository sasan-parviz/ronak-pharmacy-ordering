import { Distribution } from "./destribution";

export interface Pharmacy {
  id: string;
  name: string;
  city: string;
  province: string;
  distributions: Distribution[];
}
