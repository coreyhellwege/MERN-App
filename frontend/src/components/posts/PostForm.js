import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addPost } from "../../actions/post";

const PostForm = ({ addPost }) => {
  const [text, setText] = useState("");

  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addPost({ text }); // as an object pass in the text. This will be the formData in the addPost action
          // Then clear the form
          setText("");
        }}
      >
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Create a post"
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(
  null, // because we're not bringing in any state from Redux
  { addPost }
)(PostForm);
