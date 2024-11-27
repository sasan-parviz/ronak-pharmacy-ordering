import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SelectElement, TextFieldElement } from "react-hook-form-mui";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { differenceInHours } from "date-fns-jalali";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import { DialogTitle, Button, Typography, Box, IconButton, Container, TextField } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import axios from "axios";
import { Order, OrderProductCount, Product } from "../../models";
import { editOrder, setProducts } from "../../store/slices/ordersSlice";
import { RootState } from "../../store/store";
import env from "../../config/env";
import { ControlledAutocomplete } from "../../components/ControlledAutocomplete";
import { debounce } from "../../components/utils";

type Inputs = {
  pharmacy: string;
  destribution: string;
  product: Product;
  count: number;
};

const ViewOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token, products } = useSelector((state: RootState) => ({
    token: state.user.token,
    products: state.orders.products,
  }));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [order, setOrder] = useState<Order>(location.state?.order);
  const [isEditable, setIsEditable] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      pharmacy: order.pharmacy.name,
      destribution: order.distribution.name,
    },
  });
  const formValue = watch();
  const [orderProducts, setOrderProducts] = useState<OrderProductCount[]>(location.state?.order.orderProducts || []);

  useEffect(() => {
    if (!order) {
      axios
        .get(`${env.base_url}/orders/user/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setOrder(response.data);
            setOrderProducts(response.data.orderProducts);
          }
        });
    }

    const hoursSinceCreation = differenceInHours(new Date(), order.createdAt);
    setIsEditable(hoursSinceCreation < 1);
  }, [order, orderId]);

  useEffect(() => {
    if (products.length === 0) {
      axios
        .get(`${env.base_url}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch(setProducts(response.data));
        });
    }
  }, []);

  const handleAddProduct = (data: Inputs) => {
    if (data.product && data.count && data.count > 0) {
      setOrderProducts([{ product: data.product, count: data.count }, ...orderProducts]);
      resetField("product");
      resetField("count");
    }
  };

  const handleDeleteProduct = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSaveOrder = async () => {
    const serverOrder = {
      products: orderProducts.map((i) => ({ productId: i.product.id, count: i.count })),
    };
    const response = await axios.put(`${env.base_url}/orders/user/${order.id}`, serverOrder, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const newOrder = {
        ...order,
        products: orderProducts,
      };
      dispatch(editOrder({ orderId: order.id, order: newOrder }));
      handleClose();
    }
  };

  const [prodLoading, setProdLoading] = useState(false);

  return (
    <Container maxWidth="sm">
      <DialogTitle className="!px-0" display="flex" justifyContent="space-between" alignItems="center">
        <div className="flex items-center mr-[-14px]">
          <IconButton className="!absolute" aria-label="بازگشت" size="large" onClick={handleClose}>
            <ArrowForwardIos />
          </IconButton>
          <span className="mr-12">مشاهده سفارش</span>
        </div>
        {isEditable && (
          <Button
            disabled={orderProducts.length === 0}
            variant="contained"
            color="primary"
            onClick={handleSaveOrder}
            sx={{
              opacity: orderProducts.length === 0 ? 0 : 1,
            }}
          >
            ذخیره
          </Button>
        )}
      </DialogTitle>
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
        <form onSubmit={handleSubmit(handleAddProduct)} noValidate>
          <TextFieldElement
            fullWidth
            margin="dense"
            label="داروخانه"
            control={control}
            name="pharmacy"
            defaultValue={order?.pharmacy?.name}
            sx={{ mt: 2 }}
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          <Box display="flex" justifyContent="space-between" mt={1} mb={1}>
            <Typography>استان: {order?.pharmacy?.province || "----"}</Typography>
            <Typography>شهر: {order?.pharmacy?.city || "----"}</Typography>
          </Box>

          <TextFieldElement
            fullWidth
            margin="dense"
            label="پخش کننده"
            control={control}
            name="destribution"
            defaultValue={order?.distribution?.name}
            sx={{ mt: 1 }}
            disabled
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />

          <Box
            mt={2}
            mx={{
              borderBottom: "1px solid #cecece",
            }}
          ></Box>

          {isEditable && (
            <>
              <ControlledAutocomplete
                control={control}
                name="product"
                options={prodLoading ? [] : products}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="جستجو محصولات"
                    onBlur={() => {
                      setProdLoading(true);
                      axios
                        .get(`${env.base_url}/products/search?name=`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        .then((response) => {
                          dispatch(setProducts(response.data));
                          setProdLoading(false);
                        });
                    }}
                  />
                )}
                defaultValue={null}
                autoCompleteProps={{
                  fullWidth: true,
                  sx: { mt: 2 },
                  filterOptions: (x) => x,
                  loadingText: "در حال جستجو",
                  noOptionsText: "محصولی ای پیدا نشد",
                  loading: prodLoading,
                  onInputChange: debounce((e: any) => {
                    if (!e) return;
                    const query = e.target.value;
                    if (query === undefined || query === null) return;
                    setProdLoading(true);
                    axios
                      .get(`${env.base_url}/products/search?name=${query}`, {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      })
                      .then((response) => {
                        dispatch(setProducts(response.data));
                        setProdLoading(false);
                      });
                  }),
                }}
              />

              <TextFieldElement
                fullWidth
                margin="dense"
                label="تعداد محصول"
                control={control}
                sx={{ mt: 2 }}
                name="count"
                required
                type="number"
              />

              <Button
                disabled={!formValue.product || !formValue.count}
                fullWidth
                variant="contained"
                type="submit"
                color="success"
                sx={{ mt: 2 }}
              >
                افزودن محصول
              </Button>
            </>
          )}
        </form>

        <Box mt={2} sx={{ opacity: orderProducts.length > 0 ? 1 : 0.6 }}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell width="50%">محصول</TableCell>
                  <TableCell align="center">قیمت</TableCell>
                  <TableCell align="center">تعداد</TableCell>
                  {isEditable && <TableCell align="center">عملیات</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.length === 0 ? (
                  <TableRow>
                    <TableCell className="!text-center !text-slate-500 !py-4" colSpan={4} component="th" scope="row">
                      محصولی اضافه نکرده اید
                    </TableCell>
                  </TableRow>
                ) : (
                  orderProducts.map((item, index) => (
                    <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {item.product.name}
                      </TableCell>
                      <TableCell align="center">{item.product.price}</TableCell>
                      <TableCell align="center">{item.count}</TableCell>
                      {isEditable && (
                        <TableCell align="center">
                          <Button
                            className="!font-bold !text-xs !min-w-0"
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleDeleteProduct(index)}
                          >
                            حذف
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export { ViewOrder };
