import {
  useContext,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../contexts/auth/AuthContext";


const ProtectedRoute =
  ({ children }) => {

    const {
      isAuthenticated,
    } = useContext(
      AuthContext
    );


    if (!isAuthenticated) {

      return (
        <Navigate to="/" />
      );
    }

    return children;
  };

export default ProtectedRoute;