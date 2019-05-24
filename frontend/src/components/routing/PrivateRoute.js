import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  // ...rest will get any other parameters passed in
  <Route
    {...rest}
    render={props =>
      // check if user is signed in
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        // if authenticated, load the component passed in
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth // pull in all the state from auth reducer
});

export default connect(mapStateToProps)(PrivateRoute);
