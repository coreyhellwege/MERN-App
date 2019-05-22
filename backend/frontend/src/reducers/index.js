import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import post from "./post";

// Note: Redux flow for adding functionality to your app - Create a new reducer, create a new actions file, create the components

// Root reducer
export default combineReducers({
  alert,
  auth,
  profile,
  post
});
