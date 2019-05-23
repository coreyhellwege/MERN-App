// Types
import {
  GET_POST,
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  ADD_POST,
  DELETE_POST
} from "../actions/types";

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
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false
      };
    case GET_POSTS:
      return {
        ...state,
        posts: payload, // will come from the action file
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        // add to posts a copy of all posts in the state, plus the payload (which is the new post that just got created)
        posts: [payload, ...state.posts],
        loading: false
      };
    case DELETE_POST:
      return {
        ...state,
        // filter through and return all posts that don't match the payload (which is the ID of the post that got deleted)
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        // map through the posts. For each post, if it matches the post sent through the payload, return the post and add likes from the payload. Otherwise just return the post.
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    default:
      return state;
  }
}
