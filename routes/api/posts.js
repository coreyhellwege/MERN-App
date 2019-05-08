const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");
const auth = require("../../middleware/auth");

// Import models
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// Route:         POST api/posts
// Description:   Create a post
// Access:        Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // errors.array is a method available to us from the errors object
    }

    try {
      const user = await User.findById(req.user.id).select("-password"); // don't include password

      // Setup an object and instanciate a new post from the Post model
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Route:         GET api/posts
// Description:   Get all posts
// Access:        Private
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // -1 will display oldest post first
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route:         GET api/posts/:id
// Description:   Get post by ID
// Access:        Private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if there's a post with the ID
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);
    // check if the ID is not correct format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Route:         DELETE api/posts/:id
// Description:   Delete a post
// Access:        Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if the post doesn't exist
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // check that user created the post
    if (post.user.toString() !== req.user.id) {
      // need to convert user (which is an object ID) to string
      return res.status(401).json({ msg: "User not authorised" });
    }

    await post.remove();

    res.json({ msg: "Post removed " });
  } catch (err) {
    console.error(err.message);
    // check if the ID is not correct format
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// Route:         PUT api/posts/like/:id
// Description:   Like a post
// Access:        Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Route:         PUT api/posts/unlike/:id
// Description:   Un-like a post
// Access:        Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    // Remove out of likes array
    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
