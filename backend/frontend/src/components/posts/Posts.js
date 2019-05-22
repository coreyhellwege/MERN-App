import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import Spinner from "../layout/Spinner";

const Posts = ({ getPosts, post: { post, loading } }) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);
  return <div />;
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired, // action
  post: PropTypes.object.isRequired // post state
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
