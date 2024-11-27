import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import { LoginPage, OtpPage, MainPage, ViewOrder } from "./pages";
import PrivateRoute from "./components/PrivateRoute";

const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: '"IRANSans-web", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          font-family: "IRANSans-web", Arial, sans-serif;
        }
      `,
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/main" element={<MainPage />} />
              <Route path="/order/:orderId" element={<ViewOrder />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
