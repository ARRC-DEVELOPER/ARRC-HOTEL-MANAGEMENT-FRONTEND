import axios from "axios";
import {
  loadUserFail,
  loadUserRequest,
  loadUserSuccess,
  loginFail,
  loginRequest,
  loginSuccess,
  logoutFail,
  logoutRequest,
  logoutSuccess,
  signupFail,
  signupRequest,
  signupSuccess,
  updateUserFail,
  updateUserRequest,
  updateUserSuccess,
} from "../reducers/userReducer";
import { server } from "../store";

export const register = (formdata) => async (dispatch) => {
  try {
    dispatch(signupRequest());
    const { data } = await axios.post(`${server}/users/signup`, formdata, {
      headers: {
        "Content-type": "application/json",
      },
      withCredentials: true,
    });

    dispatch(signupSuccess(data));
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    dispatch(signupFail(error.response.data.message));
  }
};

export const updateUser = (formdata, userId) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const { data } = await axios.put(
      `${server}/users/updateUser/${userId}`,
      formdata,
      {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch(updateUserSuccess(data));
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    dispatch(updateUserFail(error.response.data.message));
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    console.log(email, password);
    const { data } = await axios.post(
      `${server}/users/login`,
      { email, password },
      {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      }
    );

    dispatch(loginSuccess(data));
  } catch (error) {
    console.log(error.response.data.message);
    dispatch(loginFail(error.response.data.message));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${server}/users/getMyProfile`, {
      withCredentials: true,
    });

    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    console.log(error);
    dispatch(loadUserFail(error.response.data.message));
  }
};

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    const { data } = await axios.get(`${server}/users/logout`, {
      withCredentials: true,
    });

    dispatch(logoutSuccess(data.message));
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    dispatch(logoutFail(error.response.data.message));
  }
};
