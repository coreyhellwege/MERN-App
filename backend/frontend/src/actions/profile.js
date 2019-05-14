import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./types";

// Get current user's profile
export const getCurrentProfile = () => async dispatch => {
  try {
    // we don't have to pass in an ID because the route sends the token which contains the ID
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};
