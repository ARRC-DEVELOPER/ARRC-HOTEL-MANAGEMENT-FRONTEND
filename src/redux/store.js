import { configureStore } from "@reduxjs/toolkit";

// Importing Reducers
import userReducer from "./reducers/userReducer";
import adminReducer from "./reducers/adminReducer";

// PRODUCTION
// export const server = "https://blog-server-sp45.onrender.com/api/v1";

// DEVELOPMENT
export const server = "http://127.0.0.1:5000/api/v1";

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
  },
});

export default store;
