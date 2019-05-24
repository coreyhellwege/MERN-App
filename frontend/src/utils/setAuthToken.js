import axios from "axios";

// In this function we're using axios to add the token to a global header for every request

const setAuthToken = token => {
  // check to see if there's a token in local storage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
