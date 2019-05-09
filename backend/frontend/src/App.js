import React, { Fragment } from "react";
// Fragment is a ghost element which doesn't appear in the DOM
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";

const App = () => (
  <Fragment>
    <Navbar />
    <Landing />
  </Fragment>
);

export default App;
