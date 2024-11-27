import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

import { setUser } from "../../store/slices/userSlice";
import env from "../../config/env";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  if (!location.state?.phoneNumber) {
    navigate("../");
    return null;
  }
  const { phoneNumber } = location.state;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${env.base_url}/auth/verify-otp`, { phoneNumber, otp });
      if (response.data.token) {
        dispatch(
          setUser({
            token: response.data.token,
            ...response.data.user,
          })
        );
        navigate("/main");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <div className="w- flex flex-col items-center rounded border-[1px] border-gray-200 border-solid bg-[#f9f9f9] shadow-md p-4 mt-4">
        <img className="w-20 h-20 object-contain" src="./assets/images/ronak-logo.png" alt="logo" />
        <Typography
          component="h1"
          sx={{
            fontSize: 18,
            textAlign: "center",
            lineHeight: 1.5,
            color: "#555555",
            fontWeight: 500,
          }}
        >
          سیستم سفارش داروخانه
          <br />
          محصولات روناک
        </Typography>

        <Typography
          component="h5"
          sx={{
            fontSize: 12,
            textAlign: "center",
            color: "#555555",
            marginTop: 8,
          }}
        >
          لطفا کد ارسال شده به شماره تلفن <span className="font-bold text-cyan-800">{phoneNumber}</span> را وارد کنید
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            marginBottom: 1.5,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="کد پیامکی"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            slotProps={{
              htmlInput: {
                title: "کد پیامکی را وارد کنید",
                required: true,
                autoFocus: true,
              },
            }}
          />
          <Button type="submit" fullWidth variant="contained" startIcon={<LockIcon />}>
            ورود
          </Button>
        </Box>
      </div>
    </Container>
  );
};

export { OtpPage };
