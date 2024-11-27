import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns-jalali";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, Fab, IconButton, Typography } from "@mui/material";
import ArrowLeft from "@mui/icons-material/AdsClick";
import AddIcon from "@mui/icons-material/Add";
import Logout from "@mui/icons-material/Logout";

import { AddOrder } from "../addOrder";
import { RootState } from "../../store/store";
import { setOrders, addOrder } from "../../store/slices/ordersSlice";
import { clearUser } from "../../store/slices/userSlice";
import { Order, OrderProductCount } from "../../models";
import "./main.css";
import env from "../../config/env";

const Tag: React.FC<OrderProductCount> = ({ product, count }) => (
  <div className="tag flex text-xs items-center border border-gray-300 rounded px-2 py-1 m-1">
    <span>{product.name}</span>
    <span className="mx-1">x</span>
    <span>{count}</span>
  </div>
);

const OrderItem: React.FC<{ order: Order }> = ({ order }) => (
  <Link to={`/order/${order.id}`} state={{ order }} className="no-underline">
    <Card className="order-item mx-1 my-4 !bg-slate-200">
      <CardContent className="!pb-[14px]">
        <div className="flex justify-between items-center">
          <Typography variant="h6" className="!text-base mt-2">
            {order.pharmacy.name}
          </Typography>
          <span className="text-gray-500 font-bold text-xs">{format(order.createdAt, "yyyy-MM-dd")}</span>
        </div>
        <div className="tags flex flex-wrap mt-2 mb-1">
          {order.orderProducts.map((product, index) => (
            <Tag key={index} {...product} />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Typography variant="body2" className="text-gray-700">
            {order.distribution.name}
          </Typography>
          <ArrowLeft className="text-slate-700" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

const MainPage: React.FC = () => {
  const dispatch = useDispatch();
  const { orders, token } = useSelector((state: RootState) => ({
    orders: state.orders.orders,
    token: state.user.token,
  }));

  const [isAddOrderOpen, setAddOrderOpen] = useState(false);

  const fetchOrders = async () => {
    const response = await axios.get(`${env.base_url}/orders/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      dispatch(setOrders(response.data));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAddOrder = async (order: Order) => {
    const serverOrder = {
      pharmacyId: order.pharmacy.id,
      distributionId: order.distribution.id,
      products: order.orderProducts.map((i) => ({ productId: i.product.id, count: i.count })),
    };
    const response = await axios.post(`${env.base_url}/orders/user`, serverOrder, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 201) {
      dispatch(addOrder(order));
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div className="main-page max-w-sm mx-auto p-4 relative flex flex-col">
      <IconButton className="!absolute !top-3 !self-end" aria-label="بازگشت" size="large" onClick={handleLogout}>
        <Logout />
      </IconButton>
      <Typography variant="h5" className="text-center">
        لیست سفارشات
      </Typography>
      <Typography variant="body2" className="text-center text-sm mt-2">
        خوش آمدید عزیز
      </Typography>
      <Fab className="!fixed bottom-3 !mr-3" color="primary" aria-label="add" onClick={() => setAddOrderOpen(true)}>
        <AddIcon />
      </Fab>
      <div className="order-list overflow-y-auto max-h-screen mt-4 select-none pb-10">
        {orders.map((order, index) => (
          <OrderItem key={index} order={order} />
        ))}
      </div>
      <AddOrder open={isAddOrderOpen} onClose={() => setAddOrderOpen(false)} onSave={handleAddOrder} />
    </div>
  );
};

export { MainPage };
