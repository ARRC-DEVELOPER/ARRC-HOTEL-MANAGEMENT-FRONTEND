import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store";
import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChakraProvider>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </ChakraProvider>
  // </React.StrictMode>
);
