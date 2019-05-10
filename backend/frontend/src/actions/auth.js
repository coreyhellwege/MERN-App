import axios from "axios";
import { setAlert } from "./alert";
import { REGISTER_SUCCESS, REGISTER_FAIL } from "./types";

// Register User Action - use axios to send data to the backend
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, password }); // prepare data to send

  try {
    const res = await axios.post("/api/users", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data // will be token
    });
  } catch (err) {
    const errors = err.response.data.errors; // get array of errors from the response

    // loop through errors if there are any
    if (errors) {
      // show alert for each error
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};
