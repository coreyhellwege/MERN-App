import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  // formData is the state (which is an object with all the form data)
  // setFormData is the function used to update the state
  // useState() is a hook
  const [formData, setFormData] = useState({
    // default values for initial state
    email: "",
    password: ""
  });

  // destructure for shorter syntax to access values from formData
  const { email, password } = formData;

  const onChange = e =>
    // set name to the value of the input
    setFormData({ ...formData, [e.target.name]: e.target.value });
  // the spread operator '...' copies the contents of the object

  const onSubmit = e => {
    e.preventDefault();
    console.log("SUCCESS");
  };

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign In to your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
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
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;
