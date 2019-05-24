import React from "react";
import PropTypes from "prop-types";
// any time you want a component to interact with redux, whether you're calling an action or getting the state, you need to use connect
import { connect } from "react-redux";

const Alert = ({ alerts }) =>
  // check that alerts aren't null and the array isn't empty
  // then map through alerts and output the message and style class
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    // return JSX for each alert
    // whenever you map through an array and output JSX it's a list and you must have a unique key
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired // ES7 - ptar
};

// map the redux state to a prop in this component so we have access to it (array of alerts)
const mapStateToProps = state => ({
  alerts: state.alert // from Root Reducer
});

export default connect(mapStateToProps)(Alert);
