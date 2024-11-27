import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

import env from "../../config/env";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${env.base_url}/auth/request-otp`, { phoneNumber });
      navigate("/otp", { state: { phoneNumber } });
    } catch (error) {
      console.error("Error sending OTP:", error);
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
          لطفا جهت ورود شماره تلفن خود را وارد کنید
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
            id="phoneNumber"
            label="شماره تلفن"
            name="phoneNumber"
            autoComplete="tel"
            autoFocus
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            slotProps={{
              htmlInput: {
                pattern: "09[0-9]{9}",
                title: "فرمت شمراه تلفن: 09xxxxxxxxx",
                required: true,
                autoFocus: true,
                autoComplete: "tel",
                maxLength: 11,
              },
            }}
          />
          <Button type="submit" fullWidth variant="contained" startIcon={<PhoneIcon />}>
            ارسال کد
          </Button>
        </Box>
      </div>
    </Container>
  );
};

export { LoginPage };
