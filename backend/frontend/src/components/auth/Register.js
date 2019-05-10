import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux"; // must also be exported
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register }) => {
  // formData is the state (which is an object with all the form data)
  // setFormData is the function used to update the state
  // useState() is a hook
  const [formData, setFormData] = useState({
    // default values for initial state
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  // destructure for shorter syntax to access values from formData
  const { name, email, password, password2 } = formData;

  const onChange = e =>
    // set name to the value of the input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // the spread operator '...' copies the contents of the object

  const onSubmit = e => {
    e.preventDefault(); // prevent default because it's submit

    // make sure passwords match
    if (password !== password2) {
      // pass in error message to action
      setAlert("Passwords do not match", "danger"); // danger = the alert type
    } else {
      register({ name, email, password }); // call register
    }
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

// Add props as prop types
Register.propTypes = {
  setAlert: PropTypes.func.isRequired, // ES7 keyboard shortcut - ptfr
  register: PropTypes.func.isRequired
};

// To use an action you have imported, you must pass it into connect
export default connect(
  null, // Connect takes in: the state you want to map
  { setAlert, register } // and an object with any actions you want to use
)(Register);
