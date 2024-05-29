import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CheckoutProvider } from "./contexts/CheckoutContext.jsx";
import {HelmetProvider} from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CheckoutProvider>
        <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
        </BrowserRouter>
      </CheckoutProvider>
    </AuthProvider>
  </React.StrictMode>
);
