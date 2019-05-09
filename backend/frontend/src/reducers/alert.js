import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

// Reducer
// this is a function that takes in state and an action (sourced from an actions file)

const initialState = []; // this will contain alerts (which are objects)

export default function(state = initialState, action) {
  // action contains type and payload
  const { type, payload } = action; // pull out type and payload from action (destructure)

  switch (action.type) {
    // copy any alerts currently in state and add the new alert (payload)
    case SET_ALERT: // convention is to use variables for types
      return [...state, payload];

    // remove an alert by ID
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); // for each alert, check if the ID is not equal to the payload (ID)

    default:
      return state;
  }
}
