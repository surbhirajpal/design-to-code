import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ConfigProvider, theme } from "antd";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgBase: '#141517', 
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>
);
