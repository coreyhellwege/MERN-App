import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
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
      console.log("Passwords do not match");
    } else {
      console.log(formData); // we have access to the state directly
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
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
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
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
            required
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

export default Register;
