import Axios from "axios";
import { API_URL } from "../../constants/API";
import Cookie from "universal-cookie";
import userTypes from "../types/user";

import swal from "sweetalert"

const { ON_LOGIN_FAIL, ON_LOGIN_SUCCESS, ON_LOGOUT_SUCCESS } = userTypes;

const cookie = new Cookie();

export const loginHandler = (userData) => {
  return (dispatch) => {
    const { username, password } = userData;
    Axios.get(`${API_URL}/users/login`, {
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        swal("Fail", `${err.response.data.message} for ${username} `, "error");
      });
  };
};

export const userKeepLogin = (userData) => {
  const { id } = userData
  return (dispatch) => {
    Axios.get(`${API_URL}/users/keeplogin/${id}`, userData)
      .then((res) => {
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};


export const registerHandler = (userData) => {
  return (dispatch) => {
    Axios.post(`${API_URL}/users`, {
      username: userData.username,
      fullName: userData.fullName,
      email: userData.email,
      address: userData.address,
      password: userData.password,
      role: "user"

    })
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
        swal("Fail", err.response.data.message, "error");
      });
  };
};

export const EditProfileHandler = (userData) => {
  const { newPassword, oldPassword } = userData
  return (dispatch) => {
    Axios.put(`${API_URL}/users/editProfile/${oldPassword}/${newPassword}`, userData)
      .then((res) => {
        console.log(res.data);
        dispatch({
          type: ON_LOGIN_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        swal("Fail", err.response.data.message, "error");
      });
  };
};

export const forgetPasswordHandler = (userData) => {
  return (dispatch) => {
    const { username } = userData
    Axios.get(`${API_URL}/users/forgetPassword/${username}`)
      .then((res) => {
        console.log(res.data);
        swal("Success!", "Check Your Email to Change the Password", "success")
      })
      .catch((err) => {
        swal("Fail", err.response.data.message, "error");
      });
  }
}

export const saveForgetPasswordHandler = (userData) => {
  const { newPassword, username } = userData
  console.log(username)
  return (dispatch) => {
    Axios.put(`${API_URL}/users/saveForgetPassword/${username}/${newPassword}`)
      .then((res) => {
        console.log(res.data);
        swal("Success!", "Your New Password is Saved", "success")
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

export const logoutHandler = () => {
  cookie.remove("authData");
  return {
    type: ON_LOGOUT_SUCCESS,
  };
};

export const cookieChecker = () => {
  return {
    type: "COOKIE_CHECK",
  };
};

export const itemInCart = (userId) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/cart/userCart/${userId}`)
      .then((res) => {
        dispatch({
          type: "ITEM_IN_CART",
          payload: res.data.length
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
export const searchBarHandler = (searchkey) => {
  return {
    type: "SEARCH_ITEMS",
    payload: searchkey,
  }
}

export const ProductCategory = (category) => {
  return {
    type: "PRODUCT_CATEGORY",
    payload: category
  }
}

export const totalPrice = (price) => {
  return {
    type: "TOTAL_PRICE",
    payload: price
  }
}