import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

// Create setAlert action

// dispatch allows us to send more than one action type to the reducer from this function via the thunk middleware
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
  // Create a random universal ID using the uuid package
  const id = uuid.v4();

  // Call set_alert
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
  // after 5 seconds call remove_alert
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
