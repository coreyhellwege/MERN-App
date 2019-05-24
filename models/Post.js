const mongoose = require("mongoose");
const Schema = mongoose.Schema; // assign mongoose.Schema to it's own variable for shorter syntax

const PostSchema = new Schema({
  // posts should be associated with a user
  user: {
    type: Schema.Types.ObjectId,
    ref: "users" // reference user model
  },
  text: {
    type: String,
    required: true
  },
  name: {
    // username (not title of post)
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    // for the post
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("post", PostSchema);
