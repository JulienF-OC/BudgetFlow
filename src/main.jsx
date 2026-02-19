import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TransactionsProvider } from "./context/TransactionsContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TransactionsProvider>
        <App />
      </TransactionsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
