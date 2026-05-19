import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import axios from "axios";

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Dynamically handle backend base URL in dev vs production
axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("http://localhost:3000")) {
      const baseURL = import.meta.env.DEV ? "http://localhost:3000" : "";
      config.url = config.url.replace("http://localhost:3000", baseURL);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
