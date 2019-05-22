// Types
import { GET_POSTS, POST_ERROR } from "../actions/types";

// Create the initial state
const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

// Create the function
export default function(state = initialState, action) {
  // pull out type and payload from the action
  const { type, payload } = action;

  // Evaluate the type
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload, // will come from the action file
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
