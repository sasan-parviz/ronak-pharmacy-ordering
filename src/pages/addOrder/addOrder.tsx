import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, SelectElement, TextFieldElement, useController } from "react-hook-form-mui";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Box,
  IconButton,
  CircularProgress,
  Autocomplete,
  TextField,
  useForkRef,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import axios from "axios";
import { OrderProductCount, Pharmacy, Product } from "../../models";
import { RootState } from "../../store/store";
import env from "../../config/env";
import { setPharmacies, setProducts } from "../../store/slices/ordersSlice";
import { debounce } from "../../components/utils";
import { ControlledAutocomplete } from "../../components/ControlledAutocomplete";

type Inputs = {
  pharmacy: Pharmacy;
  destribution: string;
  product: Product;
  count: number;
};

const AddOrder: React.FC<{ open: boolean; onClose: () => void; onSave: (order: any) => Promise<boolean> }> = ({
  open,
  onClose,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    resetField,
    formState: { errors },
  } = useForm<Inputs>();
  const dispatch = useDispatch();
  const formValue = watch();

  const pharmacyValue = formValue.pharmacy as unknown as Pharmacy;

  const { pharmacies, products, token } = useSelector((state: RootState) => ({
    pharmacies: state.orders.pharmacies,
    products: state.orders.products,
    token: state.user.token,
  }));

  const [orderProducts, setOrderProducts] = useState<OrderProductCount[]>([]);

  useEffect(() => {
    if (pharmacies.length === 0) {
      axios
        .get(`${env.base_url}/pharmacies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          dispatch(setPharmacies(response.data));
        });
    }

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
    resetField("pharmacy");
    reset();
    setOrderProducts([]);
    onClose();
  };

  const handleSaveOrder = async () => {
    const order = {
      pharmacy: pharmacyValue,
      distribution: JSON.parse(formValue.destribution),
      orderProducts,
      createdAt: new Date(),
    };
    const res = await onSave(order);
    if (res) handleClose();
  };

  const [pLoading, setPLoading] = useState(false);
  const [prodLoading, setProdLoading] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} fullWidth fullScreen>
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
        <div className="flex items-center mr-[-14px]">
          <IconButton className="!absolute" aria-label="بازگشت" size="large" onClick={handleClose}>
            <ArrowForwardIos />
          </IconButton>
          <span className="mr-12">سفارش جدید</span>
        </div>
        <Button
          disabled={orderProducts.length === 0}
          variant="contained"
          color="secondary"
          onClick={handleSaveOrder}
          sx={{
            opacity: orderProducts.length === 0 ? 0 : 1,
          }}
        >
          ثبت
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(handleAddProduct)} noValidate>
          <ControlledAutocomplete
            control={control}
            name="pharmacy"
            options={pLoading ? [] : pharmacies}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="جستجو داروخانه"
                onBlur={() => {
                  setPLoading(true);
                  axios
                    .get(`${env.base_url}/pharmacies/search?name=`, {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    })
                    .then((response) => {
                      dispatch(setPharmacies(response.data));
                      setPLoading(false);
                    });
                }}
              />
            )}
            defaultValue={null}
            autoCompleteProps={{
              filterOptions: (x) => x,
              loadingText: "در حال جستجو",
              noOptionsText: "داروخانه ای پیدا نشد",
              loading: pLoading,
              onInputChange: debounce((e: any) => {
                if (!e) return;
                const query = e.target.value;
                if (query === undefined || query === null) return;
                setPLoading(true);
                axios
                  .get(`${env.base_url}/pharmacies/search?name=${query}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  })
                  .then((response) => {
                    dispatch(setPharmacies(response.data));
                    setPLoading(false);
                  });
              }),
            }}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            mt={2}
            sx={{
              opacity: !!pharmacyValue ? 1 : 0.4,
            }}
          >
            <Typography>استان: {pharmacyValue?.province || "----"}</Typography>
            <Typography>شهر: {pharmacyValue?.city || "----"}</Typography>
          </Box>

          <SelectElement
            label="پخش کننده"
            fullWidth
            required
            sx={{ mt: 2, opacity: pharmacyValue ? 1 : 0 }}
            control={control}
            name="destribution"
            disabled={!pharmacyValue}
            options={pharmacyValue?.distributions.map((dist) => ({ id: JSON.stringify(dist), label: dist.name }))}
          />

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
              sx: { mt: 2, opacity: pharmacyValue ? 1 : 0 },
              disabled: !pharmacyValue,
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
            sx={{ mt: 2, opacity: pharmacyValue ? 1 : 0 }}
            name="count"
            required
            type="number"
          />

          <Button
            disabled={!pharmacyValue || !formValue.product || !formValue.count || !formValue.destribution}
            fullWidth
            variant="contained"
            type="submit"
            color="primary"
            sx={{ mt: 2, opacity: pharmacyValue ? 1 : 0 }}
          >
            افزودن محصول
          </Button>
        </form>

        {pharmacyValue && (
          <Box mt={2} sx={{ opacity: orderProducts.length > 0 ? 1 : 0.6 }}>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width="50%">محصول</TableCell>
                    <TableCell align="center">قیمت</TableCell>
                    <TableCell align="center">تعداد</TableCell>
                    <TableCell align="center">عملیات</TableCell>
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
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { AddOrder };
