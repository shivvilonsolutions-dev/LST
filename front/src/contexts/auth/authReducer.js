const authReducer =
  (state, action) => {

    switch (action.type) {

      case "LOGIN_SUCCESS":

        return {
          ...state,

          isAuthenticated: true,

          user:
            action.payload.user,

          token:
            action.payload.token,
        };


      case "LOGOUT":

        return {
          isAuthenticated: false,

          user: null,

          token: null,
        };


      default:
        return state;
    }
  };

export default authReducer;