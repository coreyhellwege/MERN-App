import axios from "axios";
import { setAlert } from "./alert";

import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  UPDATE_PROFILE,
  PROFILE_ERROR,
  CLEAR_PROFILE,
  ACCOUNT_DELETED
} from "./types";

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

// Get all profiles
export const getProfiles = () => async dispatch => {
  // prevent last profile from flashing
  dispatch({ type: CLEAR_PROFILE });

  try {
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get profile by ID
export const getProfileById = userId => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get Github repositories
export const getGitHubRepos = username => async dispatch => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create or update profile

// Parameters:
// formData = data submitted from the form
// history = an object which has a method called push that will redirect to a client side route after the form is submitted
// edit = true if we're editing a profile, false if we're creating a profile

export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // make the request to the backend
    const res = await axios.post("/api/profile", formData, config);

    // dispatch to reducer
    dispatch({
      type: GET_PROFILE,
      payload: res.data // profile
    });

    // set an alert to display profile created/edited
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    // if editing, no redirect. If creating profile redirect
    if (!edit) {
      history.push("/dashboard"); // this is how you redirect in an action
    }
  } catch (err) {
    // validation errors (will trigger if a required field is missed etc)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    // standard errors
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  // takes in history so we can redirect to dashboard
  try {
    // sending data to the headers
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // make the request to the backend
    const res = await axios.put("/api/profile/experience", formData, config);

    // dispatch to reducer
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data // profile
    });

    // set an alert to display profile created/edited
    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard"); // this is how you redirect in an action
  } catch (err) {
    // validation errors (will trigger if a required field is missed etc)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    // standard errors
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  // takes in history so we can redirect to dashboard
  try {
    // sending data to the headers
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // make the request to the backend
    const res = await axios.put("/api/profile/education", formData, config);

    // dispatch to reducer
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data // profile
    });

    // set an alert to display profile created/edited
    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard"); // this is how you redirect in an action
  } catch (err) {
    // validation errors (will trigger if a required field is missed etc)
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    // standard errors
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
    });
  }
};

// Delete Account & Profile
export const deleteAccount = () => async dispatch => {
  // Confirm user wants to delete acount
  if (window.confirm("Are you sure you want to delete your account?")) {
    try {
      await axios.delete(`/api/profile`);

      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: ACCOUNT_DELETED });

      dispatch(setAlert("Your account has been deleted", "success"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status } // get the error message and code from the backend
      });
    }
  }
};
