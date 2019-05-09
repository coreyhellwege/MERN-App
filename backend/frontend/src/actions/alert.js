import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setAlert = (msg, alertType) => dispatch => {
  // Create a random universal ID
  const id = uuid.v4();

  // Call set_alert
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });
};
