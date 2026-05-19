import {
  useReducer,
  useEffect,
} from "react";

import authReducer
  from "./authReducer";

import {
  AuthContext,
} from "./AuthContext";


const initialState = {
  isAuthenticated: false,

  user: null,

  token: null,
};


export const AuthProvider =
  ({ children }) => {

    const [state, dispatch] =
      useReducer(
        authReducer,
        initialState
      );

      

    useEffect(() => {

      const token =
        localStorage.getItem(
          "token"
        );

      const user =
        localStorage.getItem(
          "user"
        );

      if (
        token &&
        user
      ) {

        dispatch({
          type:
            "LOGIN_SUCCESS",

          payload: {
            token,

            user:
              JSON.parse(user),
          },
        });
      }

    }, []);


    const login =
      (data) => {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            data.user
          )
        );

        dispatch({
          type:
            "LOGIN_SUCCESS",

          payload: data,
        });
      };


    const logout =
      () => {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        dispatch({
          type: "LOGOUT",
        });
      };

    return (

      <AuthContext.Provider
        value={{
          ...state,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };