import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"), // get token from the back end
  isAuthenticated: null, // gets set to true after user is authenticated
  loading: true, // this gets set to false after we get the response from the request
  user: null // name, email, avatar etc ends up here
};

export default function(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
      localStorage.setItem("token", payload.token); // add the token to local storage
      return {
        ...state, // return whatever is currently in state
        ...payload, // return the payload
        isAuthenticated: true,
        loading: false // finished loading
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
