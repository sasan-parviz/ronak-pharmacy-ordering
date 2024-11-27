import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, Pharmacy, Product } from "../../models";

interface OrdersState {
  orders: Order[];
  pharmacies: Pharmacy[];
  products: Product[];
}

const initialState: OrdersState = {
  orders: [
    // {
    //   id: "231cznioj128y",
    //   date: new Date(2024, 10, 17),
    //   pharmacy: {
    //     id: "z9231nx23yx",
    //     name: "دارخانه دکتر پرویز",
    //     city: "کرج",
    //     province: "تهران",
    //     distributions: [
    //       {
    //         id: "1231cxz92",
    //         name: "پخش نور",
    //       },
    //       {
    //         id: "9281936jjs2",
    //         name: "پخش کیانی",
    //       },
    //     ],
    //   },
    //   distribution: {
    //     id: "9281936jjs2",
    //     name: "پخش کیانی",
    //   },
    //   products: [
    //     {
    //       product: {
    //         id: "lpag26194",
    //         name: "محصول 3",
    //         price: "20000",
    //       },
    //       count: 35,
    //     },
    //     {
    //       product: {
    //         id: "mzcjs823h1",
    //         name: "محصول 4",
    //         price: "25000",
    //       },
    //       count: 83,
    //     },
    //     {
    //       product: {
    //         id: "zcmkpkmp123",
    //         name: "محصول 5",
    //         price: "30000",
    //       },
    //       count: 35,
    //     },
    //     {
    //       product: {
    //         id: "312niuj289",
    //         name: "محصول 2",
    //         price: "15000",
    //       },
    //       count: 12,
    //     },
    //   ],
    // },
    // {
    //   id: "123adc4567xcz89",
    //   date: new Date(2024, 3, 12),
    //   pharmacy: {
    //     id: "2312-cas-231",
    //     name: "داروخانه دکتر سلامت",
    //     city: "شهرکرد",
    //     province: "تهران",
    //     distributions: [
    //       { id: "1231cxz92", name: "پخش نور" },
    //       { id: "mxkso123", name: "پخش مواد معدنی" },
    //     ],
    //   },
    //   distribution: { id: "1231cxz92", name: "پخش نور" },
    //   products: [
    //     {
    //       product: {
    //         id: "nxmz231b4",
    //         name: "محصول 1",
    //         price: "10000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "312niuj289",
    //         name: "محصول 2",
    //         price: "15000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "lpag26194",
    //         name: "محصول 3",
    //         price: "20000",
    //       },
    //       count: 2,
    //     },
    //   ],
    // },
    // {
    //   id: "123cz52c31289",
    //   date: new Date(2024, 6, 13),
    //   pharmacy: {
    //     id: "2312-cas-231",
    //     name: "داروخانه دکتر حیدری",
    //     city: "تهران",
    //     province: "تهران",
    //     distributions: [
    //       { id: "1231cxz93", name: "پخش رضایی" },
    //       { id: "mxkso123", name: "پخش مواد معدنی" },
    //     ],
    //   },
    //   distribution: { id: "1231cxz93", name: "پخش رضایی" },
    //   products: [
    //     {
    //       product: {
    //         id: "nxmz231b4",
    //         name: "محصول 5",
    //         price: "10000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "312niuj289",
    //         name: "محصول 6",
    //         price: "15000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "lpag26194",
    //         name: "محصول 7",
    //         price: "20000",
    //       },
    //       count: 2,
    //     },
    //   ],
    // },
    // {
    //   id: "1zc1235162ch",
    //   date: new Date(2024, 8, 8),
    //   pharmacy: {
    //     id: "2312-cas-231",
    //     name: "داروخانه دکتر حافظ",
    //     city: "کرج",
    //     province: "البرز",
    //     distributions: [
    //       { id: "1231cxz92", name: "پخش نور" },
    //       { id: "mxkso123", name: "پخش مواد معدنی" },
    //     ],
    //   },
    //   distribution: { id: "1231cxz92", name: "پخش نور" },
    //   products: [
    //     {
    //       product: {
    //         id: "nxmz231b4",
    //         name: "محصول 1",
    //         price: "10000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "312niuj289",
    //         name: "محصول 2",
    //         price: "15000",
    //       },
    //       count: 2,
    //     },
    //     {
    //       product: {
    //         id: "lpag26194",
    //         name: "محصول 3",
    //         price: "20000",
    //       },
    //       count: 2,
    //     },
    //   ],
    // },
  ],
  pharmacies: [],
  products: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
    },
    editOrder: (state, action: PayloadAction<{ orderId: string; order: Order }>) => {
      const index = state.orders.findIndex((order) => order.id === action.payload.orderId);
      if (index !== -1) {
        state.orders[index] = action.payload.order;
      }
    },
    setPharmacies: (state, action: PayloadAction<Pharmacy[]>) => {
      state.pharmacies = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setOrders, addOrder, editOrder, setPharmacies, setProducts } = ordersSlice.actions;
export default ordersSlice.reducer;
